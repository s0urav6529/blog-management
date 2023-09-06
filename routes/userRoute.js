const express = require("express");
const {
  loadLogin,
  varifyLogin,
  userProfile,
  loadLogout,
  loadforgetpassword,
  forgetPasswordVarify,
} = require("../controllers/userController");
const { isLogout, isLogin } = require("../middlewares/adminLoginAuth");
const userRoute = express.Router();

//user routes
userRoute.route("/login").get(isLogout, loadLogin).post(varifyLogin);
userRoute.route("/logout").get(isLogin, loadLogout);
userRoute.route("/profile").get(userProfile);
userRoute
  .route("/forget-password")
  .get(isLogout, loadforgetpassword)
  .post(isLogout, forgetPasswordVarify);

module.exports = userRoute;
