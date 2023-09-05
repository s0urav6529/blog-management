const isLogin = async (req, res, next) => {
  try {
    if (req.session.user_id !== "undefined" && req.session.is_admin === "1") {
      next();
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err.message);
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.user_id !== "undefined" && req.session.is_admin === "1") {
      res.redirect("/dashboard");
    } else {
      next();
    }
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  isLogin,
  isLogout,
};
