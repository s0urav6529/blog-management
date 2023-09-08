//external import
const express = require("express");

//internal import
const {
  loadBlog,
  loadpost,
  addComment,
  doReply,
} = require("../controllers/blogController");

const blogRoute = express.Router();

blogRoute.route("/").get(loadBlog);
blogRoute.route("/post/:id").get(loadpost);
blogRoute.route("/add-comment").post(addComment);
blogRoute.route("/do-reply").post(doReply);

module.exports = blogRoute;
