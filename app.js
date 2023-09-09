// external module
const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const { Server } = require("socket.io");

//internal module
const dbConnection = require("./config/dbConnection");
dbConnection();
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");
const blogRoute = require("./routes/blogRoute");
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
    io.emit("new_post", postData);
  });

  // response when a comment is added by user
  socket.on("new_comment", function (commentData) {
    io.emit("new_comment", commentData);
  });

  // response when a reply is added by user to other user
  socket.on("new_reply", function (replyData) {
    io.emit("new_reply", replyData);
  });
});

//start the server
server.listen(process.env.PORT, () => {
  console.log(`Listening to port ${process.env.PORT}`);
});
