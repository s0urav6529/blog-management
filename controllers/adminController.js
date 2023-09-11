//external import
const bcrypt = require("bcrypt");

//internal import
const blogregister = require("../models/blogRegisterModel");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Setting = require("../models/settingModel");

// method for password hashing
const securedPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (err) {
    console.log(err.message);
  }
};

//registration controller
const blogRegister = async (req, res) => {
  try {
    res.render("blogRegister.ejs");
  } catch (err) {
    console.log(err.message);
  }
};

//registration save controller
const blogRegisterSave = async (req, res) => {
  try {
    // get the data from form
    const blog_title = req.body.blog_title;
    const blog_logo = req.file.filename;
    const description = req.body.description;
    const admin_name = req.body.admin_name;
    const email = req.body.email;
    const password = await securedPassword(req.body.password);

    // create object for blogRegisterModel
    const blogRegister = new blogregister({
      blog_title: blog_title,
      blog_logo: blog_logo,
      description: description,
    });

    //sava the object as document
    await blogRegister.save();

    // create object for UserModel
    const user = new User({
      name: admin_name,
      email: email,
      password: password,
      is_admin: "1",
    });

    //sava the object as document
    const userdata = await user.save();

    if (userdata) {
      res.redirect("/login");
    } else {
      res.render("blogRegister", { message: "Blog not register properly" });
    }
  } catch (err) {
    console.log(err.message);
  }
};

// load the dashboard
const dashboard = async (req, res) => {
  try {
    const allPost = await Post.find({});
    res.render("admin/dashboard", { allPost: allPost });
  } catch (err) {
    console.log(err.message);
  }
};

// load post dashboard
const loadPostDashboard = async (req, res) => {
  try {
    res.render("admin/postDashboard");
  } catch (err) {
    res.send({ success: false, msg: error.message });
  }
};

const addPost = async (req, res) => {
  try {
    let image = "";
    if (req.body.image !== "undefined") {
      image = req.body.image;
    }

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      image: image,
    });

    const postData = await post.save();

    res.send({
      success: true,
      msg: "Post Added Successfully!",
      _id: postData._id,
    });

    //res.render("admin/postDashboard", { message: "Post added successfully" });
  } catch (error) {
    res.send({ success: false, msg: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.body.id });

    res.send({ success: true, msg: "Post delete successfully" });
  } catch (error) {
    res.send({ success: false, msg: error.message });
  }
};

const uploadPostImage = async (req, res) => {
  try {
    let imagePath = "/images";
    imagePath = imagePath + "/" + req.file.filename;
    res.send({ success: true, msg: "Image uploaded!", path: imagePath });
  } catch (error) {
    res.send({ success: false, msg: error.message });
  }
};

const loadEditPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const postData = await Post.findOne({ _id: postId });

    res.render("admin/editPost.ejs", { post: postData });
  } catch (error) {
    console.log(error.message);
  }
};

const editPost = async (req, res) => {
  try {
    const postId = req.body.postId;
    const title = req.body.title;
    const content = req.body.content;
    const image = req.body.image;

    const updatedata = await Post.findByIdAndUpdate(
      { _id: postId },
      { $set: { title: title, content: content, image: image } }
    );
    res.status(200).send({ success: true, msg: "Post Updated Successfully!" });
  } catch (error) {
    res.status(500).send({ success: false, msg: error.message });
  }
};

const loadSettings = async (req, res) => {
  try {
    const setting = await Setting.findOne({});
    let postLimit = 0;
    if (setting != null) {
      postLimit = setting.post_limit;
    }

    res.render("admin/setting.ejs", { limit: postLimit });
  } catch (error) {
    console.log(error.message);
  }
};

const saveSettings = async (req, res) => {
  try {
    const postLimit = req.body.postLimit;

    await Setting.updateMany({}, { post_limit: postLimit }, { upsert: true });

    res.status(200).send({ success: true, msg: "Setting Updated!" });
  } catch (error) {
    res.status(500).send({ success: false, msg: error.message });
  }
};

module.exports = {
  blogRegister,
  blogRegisterSave,
  dashboard,
  loadPostDashboard,
  addPost,
  deletePost,
  securedPassword,
  uploadPostImage,
  loadEditPost,
  editPost,
  loadSettings,
  saveSettings,
};
