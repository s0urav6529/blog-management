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
  loadEditPost,
  editPost,
  loadSettings,
  saveSettings,
  saveAdminData,
  adminRegister,
  loadAdminLogin,
  loadUserProfile,
} = require("../controllers/adminController");
const {
  isAdminLogin,
  isAdminLogout,
} = require("../middlewares/adminLoginAuth");
const varifyLogin = require("../controllers/common/varifyLogin");

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
  .route("/add-admin")
  .get(isAdminLogin, adminRegister)
  .post(upload.single("admin_image"), saveAdminData);

adminRoute.route("/dashboard").get(isAdminLogin, dashboard);
adminRoute
  .route("/create-post")
  .get(isAdminLogin, loadPostDashboard)
  .post(isAdminLogin, addPost);

adminRoute
  .route("/upload-post-image")
  .post(upload.single("image"), isAdminLogin, uploadPostImage);

adminRoute
  .route("/login-admin")
  .get(isAdminLogout, loadAdminLogin)
  .post(varifyLogin);
adminRoute.route("/delete-post").post(isAdminLogin, deletePost);
adminRoute.route("/edit-post/:id").get(isAdminLogin, loadEditPost);
adminRoute.route("/edit-post").post(isAdminLogin, editPost);

adminRoute
  .route("/settings")
  .get(isAdminLogin, loadSettings)
  .post(saveSettings);
adminRoute.route("/users-profile").get(isAdminLogin, loadUserProfile);
module.exports = adminRoute;
