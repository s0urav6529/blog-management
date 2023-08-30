const express = require("express");
const {
  loadLogin,
  varifyLogin,
  userProfile,
} = require("../controllers/userController");
const { isLogout } = require("../middlewares/adminLoginAuth");
const userRoute = express.Router();

//user routes
userRoute.route("/login").get(isLogout, loadLogin).post(varifyLogin);
userRoute.route("/profile").get(userProfile);

module.exports = userRoute;
