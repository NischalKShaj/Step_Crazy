// requiring the modules for the project
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const multer = require("multer");

// requiring the local modules for the project
const routerHome = require("./routes/userRoutes/home");
const mongose = require("./Database/connection");
const userDb = require("./models/user/userDatabase");

// setting the express() as app
const app = express();

// setting up the port number
const port = 4000;

// setting up the public folders
app.use(express.static("public"));

// setting up the ejs page
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// setting up the routes
app.use("/", routerHome);
app.use("/login", routerHome);
app.use("/signup", routerHome);

// running the project in the specified port number
app.listen(port, () => {
  console.log(`Server started at the port ${port}`);
});
