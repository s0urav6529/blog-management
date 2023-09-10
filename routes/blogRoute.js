//external import
const express = require("express");

//internal import
const {
  loadBlog,
  loadpost,
  addComment,
  doReply,
  getLimitwisePost,
} = require("../controllers/blogController");

const blogRoute = express.Router();

blogRoute.route("/").get(loadBlog);
blogRoute.route("/post/:id").get(loadpost);
blogRoute.route("/add-comment").post(addComment);
blogRoute.route("/do-reply").post(doReply);
blogRoute.route("/get-post/:start/:limit").get(getLimitwisePost);

module.exports = blogRoute;
