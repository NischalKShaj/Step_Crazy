// this shows the admins login
// modules required for the admin login
const collection = require("../../models/admin/adminDatabase");

// for rendering the admin page
exports.getAdminPage = (req, res) => {
  res.render("admin/admin");
};

// for redirecting to the loginpage
exports.postLoginPage = (req, res) => {
 
  res.sendStatus(200);
  console.log("logout success");
};
