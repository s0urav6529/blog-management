// external module
const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");

//internal module
const dbConnection = require("./config/dbConnection");
dbConnection();
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");
const blogRoute = require("./routes/blogRoute");
const { isBlogRegistered } = require("./middlewares/isBlogRegistered");

// create server of http
const server = http.createServer(app);

// set view engine & views
app.set("view engine", "ejs");
app.set("views", "./views");

// use static path
app.use(express.static(path.join(__dirname, "public")));

// use session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

//json body parser
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//check registered or not
app.use(isBlogRegistered);

// use admin route
app.use("/", adminRoute);

// use user route
app.use("/", userRoute);

// use blog route
app.use("/", blogRoute);

//start the server
server.listen(process.env.PORT, () => {
  console.log(`Listening to port ${process.env.PORT}`);
});
