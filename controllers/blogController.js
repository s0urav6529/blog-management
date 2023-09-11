//external import
const ObjectId = require("mongoose").Types.ObjectId;
const nodemailer = require("nodemailer");

//internal import
const Post = require("../models/postModel");
const Setting = require("../models/settingModel");
const Like = require("../models/likeModel");

const sendReplyMail = async (replierName, commenterEmail, postId) => {
  try {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });
    const mailOptions = {
      from: "BMS",
      to: commenterEmail,
      subject: "Reply Notification",
      html:
        "<p>" +
        replierName +
        ', has reply to your comment.<a href = "http://localhost:5001/post/' +
        postId +
        '">Check</a> your reply.</p>',
    };
    //console.log(transport, mailOptions);
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error.message);
      } else {
        console.log("Notification email has been sent:-", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const loadBlog = async (req, res) => {
  try {
    const setting = await Setting.findOne({});
    const postLimit = setting.post_limit;

    const allpost = await Post.find({}).limit(postLimit);

    res.render("blog.ejs", { allpost: allpost, postLimit: postLimit });
  } catch (err) {
    console.log(err.message);
  }
};

const loadpost = async (req, res) => {
  try {
    const likes = await Like.find({ post_id: req.params.id, like: 1 }).count();
    const dislikes = await Like.find({
      post_id: req.params.id,
      like: 0,
    }).count();

    const singlepost = await Post.findOne({ _id: req.params.id });
    res.render("post.ejs", {
      singlepost: singlepost,
      likes: likes,
      dislikes: dislikes,
    });
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

    await Post.findByIdAndUpdate(
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

    res
      .status(200)
      .send({ success: true, msg: "Comment added!", _id: commentId });
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

    const commenterEmail = req.body.commentEmail;

    const data = await Post.updateOne(
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
    sendReplyMail(replierName, commenterEmail, postId);
    res.status(200).send({ success: true, msg: "Reply added!", _id: replyId });
  } catch (error) {
    res.status(500).send({ success: false, msg: error.message });
  }
};

const getLimitwisePost = async (req, res) => {
  try {
    const start = req.params.start;
    const limit = req.params.limit;

    const posts = await Post.find({}).skip(start).limit(limit);

    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send({ success: false, msg: error.message });
  }
};

module.exports = { loadBlog, loadpost, addComment, doReply, getLimitwisePost };
