//external import
const { ObjectId } = require("mongodb");

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
    const email = req.body.email;
    const comment = req.body.comment;
    const commentId = new ObjectId();

    await post.findByIdAndUpdate(
      { _id: postId },
      {
        $push: {
          comments: {
            _id: commentId,
            username: userName,
            email: email,
            comment: comment,
          },
        },
      }
    );
    res.status(200).send({ success: true, msg: "Comment added!" });
  } catch (error) {
    res.status(500).send({ success: false, msg: error.message });
  }
};

const doReply = async (req, res) => {
  try {
    const postId = req.body.postId;
    const commentId = req.body.commentId;
    const replierName = req.body.name;
    const reply = req.body.reply;
    const replyId = new ObjectId();

    const data = await post.updateOne(
      { _id: new ObjectId(postId), "comments._id": new ObjectId(commentId) },
      {
        $push: {
          "comments.$.replies": {
            _id: replyId,
            name: replierName,
            reply: reply,
          },
        },
      }
    );
    console.log(data);
    res.send({ success: true, msg: "Reply added!" });
  } catch (error) {
    res.send({ success: false, msg: error.message });
  }
};

module.exports = { loadBlog, loadpost, addComment, doReply };
