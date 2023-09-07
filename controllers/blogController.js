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

const addComment = async (req, res) => {
  try {
    const postId = req.body.postId;
    const userName = req.body.username;
    const comment = req.body.comment;

    await post.findByIdAndUpdate(
      { _id: postId },
      {
        $push: {
          comment: { username: userName, comment: comment },
        },
      }
    );
    res.status(200).send({ success: true, msg: "Comment added!" });
  } catch (error) {
    res.status(500).send({ success: false, msg: error.message });
  }
};

module.exports = { loadBlog, loadpost, addComment };
