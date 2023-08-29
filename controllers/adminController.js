const blogregister = require("../models/blogRegisterModel");
const User = require("../models/userModel");
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

//login controller
const login = async (req, res) => {
  res.send("Hi login here");
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

module.exports = {
  login,
  blogRegister,
  blogRegisterSave,
};
