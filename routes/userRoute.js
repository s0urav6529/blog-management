const express = require("express");
const {
  loadLogin,
  userProfile,
  loadLogout,
  loadForgetPassword,
  forgetPasswordVarify,
  loadResetPassword,
  resetPassword,
  loadAbout,
  loadContact,
  loadUserRegister,
} = require("../controllers/userController");
const { isUserLogout, isUserLogin } = require("../middlewares/adminLoginAuth");
const varifyLogin = require("../controllers/common/varifyLogin");
const userRoute = express.Router();

//user routes
userRoute.route("/login").get(isUserLogout, loadLogin).post(varifyLogin);
userRoute.route("/logout").get(isUserLogin, loadLogout);
userRoute.route("/profile").get(isUserLogin, userProfile);
userRoute.route("/register").get(isUserLogin, loadUserRegister);
userRoute
  .route("/forget-password")
  .get(isUserLogin, loadForgetPassword)
  .post(forgetPasswordVarify);

userRoute
  .route("/reset-password")
  .get(isUserLogin, loadResetPassword)
  .post(resetPassword);

userRoute.route("/about").get(loadAbout);
userRoute.route("/contact").get(loadContact);

module.exports = userRoute;
