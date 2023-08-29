const express = require("express");
const {
  loadLogin,
  varifyLogin,
  userProfile,
} = require("../controllers/userController");
const userRoute = express.Router();

//user routes
userRoute.route("/login").get(loadLogin).post(varifyLogin);
userRoute.route("/profile").get(userProfile);

module.exports = userRoute;
