const blogRegister = require("../models/blogRegisterModel");

const isBlogRegistered = async (req, res, next) => {
  try {
    const blogRegistered = await blogRegister.find({});
    if (
      Object.keys(blogRegistered).length == 0 &&
      req.originalUrl != "/blog-register"
    ) {
      res.redirect("/blog-register");
    } else {
      next();
    }
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  isBlogRegistered,
};
