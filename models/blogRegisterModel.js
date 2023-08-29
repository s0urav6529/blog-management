const mongoose = require("mongoose");

const blogRegisterSchema = mongoose.Schema(
  {
    blog_name: {
      type: String,
      required: true,
    },
    blog_logo: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("blogRegister", blogRegisterSchema);
