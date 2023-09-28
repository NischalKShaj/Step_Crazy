// importing the userdatabase
const collection = require("../../models/user/userDatabase");

// setting the routes for the usermanagement page
exports.getUserPage = (req, res) => {
  res.render("admin/usermanagement");
};

exports.postUserPage = (req, res) => {
  res.redirect("/dashboard/user");
};
