// this shows the admins login
// modules required for the admin login
const collection = require("../../models/admin/adminDatabase");
require("dotenv").config();

// for rendering the admin page
exports.getAdminPage = (req, res) => {
  res.render("admin/admin");
};


