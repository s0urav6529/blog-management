//external import
const express = require("express");

//internal import
const { loadBlog, loadpost } = require("../controllers/blogController");

const blogRoute = express.Router();

blogRoute.route("/").get(loadBlog);
blogRoute.route("/post/:id").get(loadpost);

module.exports = blogRoute;
