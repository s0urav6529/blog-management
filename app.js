// external module
const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");

//internal module
const dbConnection = require("./config/dbConnection");
dbConnection();
const adminRoute = require("./routes/adminRoute");
const { isBlogRegistered } = require("./middlewares/isBlogRegistered");

// create server of http
const server = http.createServer(app);

// set view engine & views
app.set("view engine", "ejs");
app.set("views", "./views");

// use static path
app.use(express.static(path.join(__dirname, "public")));

//json body parser
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//check registered or not
app.use(isBlogRegistered);

// use the routes
app.use("/", adminRoute);

//start the server
server.listen(process.env.PORT, () => {
  console.log(`Listening to port ${process.env.PORT}`);
});
