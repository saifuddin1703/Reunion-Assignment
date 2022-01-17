const express = require('express');
const app = express();
const authController = require('./controllers/authConroller');
const userController = require('./controllers/userController')
const postController = require('./controllers/postController')
const bodyparser = require('body-parser')
app.use(bodyparser.json())
app.get("/home",(req,res,next)=>{
    console.log("req")
    res.send("this is home route")
});

// - POST /api/authenticate should perform user authentication and return a JWT token.
//     - INPUT: Email, Password
//     - RETURN: JWT token
    

app.post("/api/authenticate",async function(req,res,next){
    console.log(req.body)
    const username = req.body.username;
    const password = req.body.password;
    try {
        const token = await authController.login(username,password);
        res.status(200).send(token)
    } catch (err) {
        res.status(401).send(err);
    }
});
//     <aside>
//     ➡️ **NOTE:** Use dummy email & password for authentication. No need to create endpoint for registering new user.
    
//     </aside>
    
// - POST /api/follow/{id} authenticated user would follow user with {id}
app.post("/api/follow/:id",authController.authenticate,async function(req,res){
    const authenticatedUserId = req.user;
    const id = req.params.id
    console.log(id);

    try {
       const token = await userController.followUser(id,authenticatedUserId);
        res.status(200).send(`following user of id ${id}`);
    } catch (err) {
        res.status(501).send(err);
    }
});
// - POST /api/unfollow/{id} authenticated user would unfollow a user with {id}
app.post("/api/unfollow/:id",authController.authenticate,async function(req,res){
    const authenticatedUserId = req.user;
    const id = req.params.id
    try {
       const token = userController.unfollowUser(id,authenticatedUserId);
        res.status(200).send("user unfollowed");
    } catch (err) {
        console.log(err);
        res.status(501);
    }
});
// - GET /api/user should authenticate the request and return the respective user profile.
//     - RETURN: User Name, number of followers & followings.

app.get("/api/user",authController.authenticate,async function(req,res){
   const user_id = req.user
   try {
       const user = await userController.getUserById(user_id);
       res.status(200).send(user);
   } catch (err) {
       console.log(err);
       res.status(501);
   }
});
// - POST api/posts/ would add a new post created by the authenticated user.
//     - Input: Title, Description
//     - RETURN: Post-ID, Title, Description, Created Time(UTC).
app.post("/api/posts",authController.authenticate,async function(req,res){
   const user_id = req.user;
   const postBody = req.body;
   postBody.createdBy = user_id
   try {
    const post = await postController.createPost(postBody);
    res.status(200).send(post);
   } catch (err) {
       console.log(err);
       res.status(501)
   }
});
// - DELETE api/posts/{id} would delete post with {id} created by the authenticated user.
app.delete("/api/posts/:id",authController.authenticate,async function(req,res){
    const post_id = req.params.id;
   try {
       const id = await postController.deletePost(post_id);
       res.status(200).send(`post of id ${id} is deleted successfully`);
   } catch (err) {
       console.log(err);
       res.status(501);
   }
});
// - POST /api/like/{id} would like the post with {id} by the authenticated user.
app.post("/api/like/:id",authController.authenticate,async function(req,res){
   const user_id = req.user;
   const post_id = req.params.id;
   try {
       const id = await postController.likePost(user_id,post_id);
       res.status(200).send(`post of id ${id} liked successfully`);
   } catch (err) {
       console.log(err);
       res.status(501);
   }
});
// - POST /api/unlike/{id} would unlike the post with {id} by the authenticated user.
app.post("/api/unlike/:id",authController.authenticate,async function(req,res){
    const user_id = req.user;
    const post_id = req.params.id;
    try {
        const id = await postController.unlikePost(user_id,post_id);
        res.status(200).send(`post of id ${id} unliked successfully`);
    } catch (err) {
        console.log(err);
        res.status(501);
    }
});
// - POST /api/comment/{id} add comment for post with {id} by the authenticated user.
//     - Input: Comment
//     - Return: Comment-ID
app.post("/api/comment/:id",authController.authenticate,async function(req,res){
    const user_id = req.user;
   const post_id = req.params.id;
   const comment = req.body.comment;
   try {
       const id =await postController.comment(comment,user_id,post_id);
       res.status(200).send(`commented on post with id ${id}`);
   } catch (err) {
        console.log(err);
        res.status(501);
   }
});
// - GET api/posts/{id} would return a single post with {id} populated with its number of likes and comments
app.get("/api/post/:id",authController.authenticate,async function(req,res){
   const post_id = req.params.id;
   try {
       const post = await postController.getPostById(post_id);
       res.status(200).send(post);
   } catch (err) {
        console.log(err);
        res.status(501);
   }
});
// - GET /api/all_posts would return all posts created by authenticated user sorted by post time.
//     - RETURN: For each post return the following values
//         - id: ID of the post
//         - title: Title of the post
//         - desc: Description of the post
//         - created_at: Date and time when the post was created
//         - comments: Array of comments, for the particular post
//         - likes: Number of likes for the particular post

app.get("/api/all_posts",authController.authenticate,async function(req,res){
   const user_id = req.user;
   try {
       const allposts = await postController.getAllPostOfUserID(user_id);
       res.status(200).send(allposts);
   } catch (err) {
    console.log(err);
    res.status(501);
}
   }
); 
module.exports = app;