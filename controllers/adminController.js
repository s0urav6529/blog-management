const blogregister = require("../models/blogRegisterModel");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const bcrypt = require("bcrypt");

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
    const blogregistered = await blogregister.find({});

    if (Object.keys(blogregistered).length > 0) {
      res.redirect("/login");
    } else {
      res.render("blogRegister");
    }
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
    res.render("admin/dashboard");
  } catch (err) {
    console.log(err.message);
  }
};

// load post dashboard
const loadPostDashboard = async (req, res) => {
  try {
    res.render("admin/postDashboard");
  } catch (err) {
    console.log(err.message);
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

const uploadPostImage = async (req, res) => {
  try {
    let imagePath = "/images";
    imagePath = imagePath + "/" + req.file.filename;
    res.send({ success: true, msg: "Image uploaded!", path: imagePath });
  } catch (error) {
    res.send({ success: false, msg: error.message });
  }
};

module.exports = {
  blogRegister,
  blogRegisterSave,
  dashboard,
  loadPostDashboard,
  addPost,
  securedPassword,
  uploadPostImage,
};
