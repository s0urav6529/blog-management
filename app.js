// external module
const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const ObjectId = require("mongoose").Types.ObjectId;

//internal module
const dbConnection = require("./config/dbConnection");
dbConnection();
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");
const blogRoute = require("./routes/blogRoute");
const Post = require("./models/postModel");
const Like = require("./models/likeModel");

const { isBlogRegistered } = require("./middlewares/isBlogRegistered");

// create server of http & socket
const server = http.createServer(app);
const io = new Server(server, {});

// set view engine & views
app.set("view engine", "ejs");
app.set("views", "./views");

// use static path
app.use(express.static(path.join(__dirname, "public")));

// use session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

//use cookie-parse
app.use(cookieParser(process.env.COOKIE_SECRET));

//json body parser
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//check registered or not
app.use(isBlogRegistered);

// use admin route
app.use("/", adminRoute);

// use user route
app.use("/", userRoute);

// use blog route
app.use("/", blogRoute);

// if anything emit inside socket it will listen
io.on("connection", (socket) => {
  // response when a post is added by admin
  socket.on("new_post", function (postData) {
    socket.broadcast.emit("new_post", postData);
  });

  // response when a comment is added by user
  socket.on("new_comment", function (commentData) {
    io.emit("new_comment", commentData);
  });

  // response when a reply is added by user to other user
  socket.on("new_reply", function (replyData) {
    io.emit("new_reply", replyData);
  });

  // response when a post is deleted by admin
  socket.on("delete_now", function (deletedPostId) {
    socket.broadcast.emit("delete_now", deletedPostId);
  });

  // response when a post is edited by admin
  socket.on("edit_now", function (editedPostData) {
    socket.broadcast.emit("edit_now", editedPostData);
  });

  // response when a post is viwes by user
  socket.on("post_views_increment", async function (postId) {
    try {
      const postData = await Post.findOneAndUpdate(
        { _id: new ObjectId(postId) },
        { $inc: { views: 1 } },
        { returnOriginal: false }
      );
      socket.broadcast.emit("post_views_increment", postData);
    } catch (error) {
      socket.broadcast.emit(
        "post_views_increment",
        "Error updating post views"
      );
    }
  });

  socket.on("new_like", async function (data) {
    try {
      await Like.updateOne(
        { post_id: data.postId, user_id: data.userId },
        { like: 1 },
        { upsert: true }
      );
      const likes = await Like.find({
        post_id: data.postId,
        like: 1,
      }).count();
      const dislikes = await Like.find({
        post_id: data.postId,
        like: 0,
      }).count();

      io.emit("new_like_dislike", {
        postId: data.postId,
        likes: likes,
        dislikes: dislikes,
      });
    } catch (error) {}
  });

  socket.on("new_dislike", async function (data) {
    try {
      await Like.updateOne(
        { post_id: data.postId, user_id: data.userId },
        { like: 0 },
        { upsert: true }
      );
      const likes = await Like.find({
        post_id: data.postId,
        like: 1,
      }).count();
      const dislikes = await Like.find({
        post_id: data.postId,
        like: 0,
      }).count();

      io.emit("new_like_dislike", {
        postId: data.postId,
        likes: likes,
        dislikes: dislikes,
      });
    } catch (error) {}
  });
});

//start the server
server.listen(process.env.PORT, () => {
  console.log(`Listening to port ${process.env.PORT}`);
});
