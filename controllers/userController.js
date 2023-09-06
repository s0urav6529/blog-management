//external import
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

//internal import
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

        if (userExist.is_admin === "1") {
          // user is admin
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

const loadLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/login");
  } catch (err) {
    console.log(err.message);
  }
};

const loadforgetpassword = async (req, res) => {
  try {
    res.render("forget-password");
  } catch (err) {
    console.log(err.message);
  }
};

const sendResetPasswordMail = async (name, email, token) => {
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
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Reset Password",
      html:
        "<p>Hi " +
        name +
        'Please click here to <a href = "http://localhost:5001/reset-password?token=' +
        token +
        '"> reset your password.</p>',
    };
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent:-", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const forgetPasswordVarify = async (req, res) => {
  try {
    const email = req.body.email;
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      const randomString = randomstring.generate();
      await User.updateOne({ email: email }, { $set: { token: randomString } });
      sendResetPasswordMail(userExist.name, userExist.email, randomString);
      res.render("forget-password", {
        message: "Please check your mail to reset password.",
      });
    } else {
      res.render("forget-password", { message: "User email not exits." });
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadLogin,
  loadLogout,
  varifyLogin,
  userProfile,
  loadforgetpassword,
  forgetPasswordVarify,
};
