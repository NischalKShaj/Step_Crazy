// this shows the admins login
// modules required for the admin login
const collection = require("../../models/admin/adminDatabase");

// for rendering the admin page
exports.getAdminPage = (req, res) => {
  const admin = req.session.admin;
  console.log(admin);
  if (admin) {
    res.render("admin/admindashboard");
  } else {
    const invalid = req.query.success;
    console.log(invalid);
    res.render("admin/admin", { invalid });
  }
};

// for redirecting to the loginpage
exports.Logout = (req, res) => {
  req.session.admin = null;
  res.redirect("/admin");
};
