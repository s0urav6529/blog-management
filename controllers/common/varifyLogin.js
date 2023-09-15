//external module
const bcrypt = require("bcrypt");

//internal module
const Admin = require("../../models/adminModel");
const User = require("../../models/userModel");

const varifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const adminOrNot = req.body.adminOrNot;

    //admin login request
    if (adminOrNot === "1") {
      const isAdmin = await Admin.findOne({ email: email });
      if (isAdmin && (await bcrypt.compare(password, isAdmin.password))) {
        req.session.adminId = isAdmin._id;
        req.session.isAdmin = isAdmin.is_admin;
        res.redirect("/dashboard");
      } else {
        res.render("login-admin.ejs", {
          message: "Email or Password is incorrect!",
        });
      }
    } else if (adminOrNot === "0") {
      //user login
      const isUser = await User.findOne({ email: email });
      if (isUser && (await bcrypt.compare(password, isUser.password))) {
        req.session.userId = isUser._id;
        req.session.isAdmin = isUser.is_admin;
        res.redirect("/profile");
      } else {
        res.render("login.ejs", { message: "Email or Password is incorrect!" });
      }
    } else {
      console.log(error.message);
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = varifyLogin;
