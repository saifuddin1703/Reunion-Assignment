const JWT = require('jsonwebtoken');
const { user, rows } = require('pg/lib/defaults');
const db = require('../config/database');

function authenticate(req,res,next){
    const token = req.headers.token;
    if(token) res.status(401);
    JWT.verify(token,process.env.secret,(err,decodedToken)=>{
        if(err){
            res.status(401).send(err);
        }else{
            req.user = decodedToken
            next();
        }
    })

}
async function login(username,password){

    // find the user id through db operation using username
    try {
        const searchQuery = `SELECT * FROM UserProfile where username = '${username}'`
        const result = await db.query(searchQuery);
        const User = result.rows[0];
        // console.log(password)
        if (password === User.password){
             const id = User._id;
             const token = JWT.sign(id,process.env.secret);
             return token;
        }else{
            throw new Error("Wrong Password");
        }
    } catch (err) {
        console.log(err)
        throw err
    }

}

exports.authenticate = authenticate;
exports.login = login;
