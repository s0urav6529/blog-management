//internal import
const post = require("../models/postModel");

const loadBlog = async (req, res) => {
  try {
    const allpost = await post.find({});
    res.render("blog", { allpost: allpost });
  } catch (err) {
    console.log(err.message);
  }
};

const loadpost = async (req, res) => {
  try {
    const singlepost = await post.findOne({ _id: req.params.id });
    res.render("post", { singlepost: singlepost });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { loadBlog, loadpost };
