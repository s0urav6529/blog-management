//external import
const { ObjectId } = require("mongodb");
const nodemailer = require("nodemailer");

//internal import
const post = require("../models/postModel");

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
        console.log(error);
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

    const commenterEmail = req.body.commentEmail;

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
    sendReplyMail(replierName, commenterEmail, postId);
    res.send({ success: true, msg: "Reply added!" });
  } catch (error) {
    res.send({ success: false, msg: error.message });
  }
};

module.exports = { loadBlog, loadpost, addComment, doReply };
