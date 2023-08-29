const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const loadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    console.log(err.message);
  }
};

const varifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userExist = await User.findOne({ email: email });

    if (userExist) {
      if (await bcrypt.compare(password, userExist.password)) {
        req.session.user_id = userExist._id;
        req.session.is_admin = userExist.is_admin;

        if (userExist.is_admin == "1") {
          res.redirect("/dashboard");
        } else {
          res.redirect("/profile");
        }
      } else {
        res.render("login", { message: "User or password incorrect!" });
      }
    } else {
      res.render("login", { message: "User or password incorrect!" });
    }
  } catch (err) {
    console.log(err.message);
  }
};

const userProfile = async (req, res) => {
  try {
    res.send("Hi user profile");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { loadLogin, varifyLogin, userProfile };
