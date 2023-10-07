// handling the session for the admin

const session = require("express-session");

module.exports = session({
  secret: "Mysecretkey",
  resave: false,
  saveUninitialized: true,
});
