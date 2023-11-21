// requiring the modules for the project
const express = require("express");
const path = require("path");

// requiring the local modules for the project
const routerHome = require("./routes/userRoutes/home");
const mongose = require("./Database/connection");
const userDb = require("./models/user/userDatabase");
const routerAdmin = require("./routes/adminRoutes/home");
const sessionAdmin = require("./middleware/admin/session");
const sessionUser = require("./middleware/user/session");
const errorPage = require("./middleware/error/404");

// setting the express() as app
const app = express();

// setting up the port number
const port = 4000;

// setting up the static folders
app.use(express.static("public"));
app.use(express.static("uploads"));

// setting up the ejs page
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// parsing the user inputed data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session for admin
app.use(sessionAdmin);

// session for user
app.use(sessionUser);

// setting up the routes
app.use("/", routerHome);
app.use("/login", routerHome);
app.use("/signup", routerHome);
app.use("/admin", routerAdmin);

// setting up the error page middleware
app.use(errorPage);

// running the project in the specified port number
app.listen(port, () => {
  console.log(`Server started at the port ${port}`);
});
