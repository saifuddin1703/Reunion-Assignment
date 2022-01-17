const { system } = require('nodemon/lib/config');
const db = require('../config/database')
async function createPost(postDetails){
    try {
        const {title,description,createdBy} = postDetails
        const created_at = Date.now(); 
        console.log(created_at)
        const inserQuery = `INSERT INTO post(title,description,createdBy,createdAt) VALUES('${title}','${description}',${createdBy},${created_at}) RETURNING _id`
        const result = await db.query(inserQuery);
        // const User = result.rows[0];
        const post = await (await db.query(`Select * from post where _id = ${result.rows[0]._id}`)).rows[0];
        console.log(post)
        return post
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function likePost(user_id,post_id){
    try {
        const inserQuery = `INSERT INTO user_like_post(user_id,post_id) VALUES(${user_id},${post_id})`
        const result = await db.query(inserQuery);
        // const User = result.rows[0];
        console.log(result)
        return result
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function unlikePost(user_id,post_id){
    try {
        const deletequery = `delete from user_like_post where user_id = ${user_id} and post_id = ${post_id}`
        const result = await db.query(deletequery);
        // const User = result.rows[0];
        console.log(result)
        return result
    } catch (err) {
        console.log(err)
        throw err
    }
}
async function getPostById(post_id){
    try {
        const searchQuery = `SELECT * FROM post where _id = ${post_id}`
        const result = await db.query(searchQuery);
        const Post = result.rows[0];
        const likesearchQuery = `SELECT * FROM user_like_post where post_id = ${post_id}`
        const commentsearchQuery = `SELECT * FROM user_comment_post where post_id = ${post_id}`
        // console.log(password)
        const likeresult = await db.query(likesearchQuery);
        const commentresult = await db.query(commentsearchQuery);

        var post = {
            title : Post.title,
            description : Post.description,
            createdAt : Post.createdAt,
            createdBy : Post.createdBy,
            like : likeresult.rowCount,
            comments : commentresult.rowCount
        }
        console.log(post)
        return post;
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function getAllPostOfUserID(user_id){
    try {
        const searchQuery = `select _id,title,description,createdAt, count(u.user_id) as likes,count(c.user_id) as comments from post p left join user_like_post u on p._id = u.post_id 
        left join user_comment_post c on p._id = c.post_id
        where p.createdBy = ${user_id}
        group by u.user_id,p._id,u.post_id 
        order by createdat`
        const result = await db.query(searchQuery);
        const Posts = result.rows;
        return Posts
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function deletePost(post_id){
    try {
        const deletequery = `delete from post where post_id = ${post_id} `
        const result = await db.query(deletequery);
        // const User = result.rows[0];
        console.log(result)
        return result
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function comment(commentBody,user_id,post_id){
    try {
        const inserQuery = `INSERT INTO user_comment_post(user_id,post_id,comment) VALUES(${user_id},${post_id},'${commentBody}') returning _id`
        const result = await db.query(inserQuery);
        // const User = result.rows[0];
        console.log(result.rows[0]._id)
        return result.rows[0]._id
    } catch (err) {
        console.log(err)
        throw err
    }
}

exports.createPost = createPost;
exports.likePost = likePost;
exports.unlikePost = unlikePost;
exports.getPostById = getPostById;
exports.getAllPostOfUserID = getAllPostOfUserID;
exports.deletePost = deletePost;
exports.comment = comment;
