const mongoose = require("mongoose");

const dbConnection = async () => {
  await mongoose
    .connect(process.env.MONGO_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("Database connection established!"))
    .catch((err) => console("Database not connected"));
};

module.exports = dbConnection;
