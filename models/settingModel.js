const mongoose = require("mongoose");

const settingSchema = mongoose.Schema(
  {
    post_limit: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("setting", settingSchema);
