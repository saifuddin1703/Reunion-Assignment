const db = require('../config/database')
async function followUser(user_id,follower_id){
    try {
        const inserQuery = `INSERT INTO user_follows_user(follower_id,following_id) VALUES(${follower_id},${user_id})`
        const result = await db.query(inserQuery);
        // const User = result.rows[0];
        console.log(result)
        return result
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function unfollowUser(user_id,follower_id){
    try {
        const deletequery = `delete from user_follows_user where follower_id = ${follower_id} and following_id = ${user_id}`
        const result = await db.query(deletequery);
        // const User = result.rows[0];
        console.log(result)
        return result
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function getUserById(user_id){
    try {
        const searchQuery = `SELECT * FROM UserProfile where _id = ${user_id}`
        const result = await db.query(searchQuery);
        const User = result.rows[0];
        const followersearchQuery = `SELECT * FROM user_follows_user where following_id = ${user_id}`
        const followingsearchQuery = `SELECT * FROM user_follows_user where follower_id = ${user_id}`
        // console.log(password)
        const followerresult = await db.query(followersearchQuery);
        const followingresult = await db.query(followingsearchQuery);

        var user = {
            username : User.username,
            followers : followerresult.rowCount,
            following : followingresult.rowCount
        }
        return user
    } catch (err) {
        console.log(err)
        throw err
    }
}

exports.followUser = followUser;
exports.unfollowUser = unfollowUser;
exports.getUserById = getUserById;