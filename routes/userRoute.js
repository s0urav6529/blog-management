const express = require("express");
const {
  loadLogin,
  varifyLogin,
  userProfile,
  loadLogout,
  loadForgetPassword,
  forgetPasswordVarify,
  loadResetPassword,
  resetPassword,
  loadAbout,
} = require("../controllers/userController");
const { isLogout, isLogin } = require("../middlewares/adminLoginAuth");
const userRoute = express.Router();

//user routes
userRoute.route("/login").get(isLogout, loadLogin).post(varifyLogin);
userRoute.route("/logout").get(isLogin, loadLogout);
userRoute.route("/profile").get(userProfile);
userRoute
  .route("/forget-password")
  .get(isLogout, loadForgetPassword)
  .post(forgetPasswordVarify);

userRoute
  .route("/reset-password")
  .get(isLogout, loadResetPassword)
  .post(resetPassword);

userRoute.route("/about").get(loadAbout);

module.exports = userRoute;
