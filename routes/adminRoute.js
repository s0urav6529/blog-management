//external import
const express = require("express");
const adminRoute = express.Router();
const multer = require("multer");
const path = require("path");

//internal import
const {
  blogRegister,
  blogRegisterSave,
  dashboard,
  loadPostDashboard,
  addPost,
  uploadPostImage,
  deletePost,
} = require("../controllers/adminController");
const { isLogin } = require("../middlewares/adminLoginAuth");

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

adminRoute
  .route("/blog-register")
  .get(blogRegister)
  .post(upload.single("blog_image"), blogRegisterSave);

adminRoute.route("/dashboard").get(isLogin, dashboard);
adminRoute
  .route("/create-post")
  .get(isLogin, loadPostDashboard)
  .post(isLogin, addPost);

adminRoute
  .route("/upload-post-image")
  .post(upload.single("image"), isLogin, uploadPostImage);

adminRoute.route("/delete-post").post(isLogin, deletePost);

module.exports = adminRoute;
