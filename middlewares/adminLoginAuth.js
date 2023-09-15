//external module
const ObjectId = require("mongoose").Types.ObjectId;

//internal module
const Admin = require("../models/adminModel");
const User = require("../models/userModel");

const isAdminLogin = async (req, res, next) => {
  try {
    //check is requester is admin?
    const requesterId = Admin.findOne(new ObjectId(req.session.adminId));
    if (requesterId !== undefined && req.session.isAdmin === "1") {
      //requester is admin;
      next();
    } else {
      res.redirect("/login-admin");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const isUserLogin = async (req, res, next) => {
  try {
    //check is requester is User?
    const requesterId = User.findOne(new ObjectId(req.session.userId));
    if (requesterId !== undefined && req.session.isAdmin === "0") {
      next();
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const isAdminLogout = async (req, res, next) => {
  try {
    const requesterId = Admin.findOne(new ObjectId(req.session.adminId));
    if (requesterId !== undefined && req.session.isAdmin === "1") {
      res.redirect("/dashboard");
    } else {
      next();
    }
  } catch (error) {
    console.log(error.message);
  }
};

const isUserLogout = async (req, res, next) => {
  try {
    const requesterId = User.findOne(new ObjectId(req.session.userId));
    if (requesterId !== undefined && req.session.isAdmin === "0") {
      res.redirect("/profile");
    } else {
      next();
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  isAdminLogin,
  isUserLogin,
  isAdminLogout,
  isUserLogout,
};
