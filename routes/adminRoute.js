//external import
const express = require("express");
const adminRoute = express.Router();
const multer = require("multer");
const path = require("path");

//internal import
const {
  login,
  blogRegister,
  blogRegisterSave,
} = require("../controllers/adminController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: (req, file, cb) => {
    const fname = Date.now() + "-" + file.originalname;
    cb(null, fname);
  },
});

// create upload varible for file
const upload = multer({ storage: storage });

adminRoute.route("/login").get(login);
adminRoute.route("/blog-register").get(blogRegister);
adminRoute
  .route("/blog-register")
  .post(upload.single("blog_image"), blogRegisterSave);

module.exports = adminRoute;
