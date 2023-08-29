const blogregister = require("../models/blogRegisterModel");
const user = require("../models/userModel");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  res.send("Hi login here");
};

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

module.exports = {
  login,
  blogRegister,
};
