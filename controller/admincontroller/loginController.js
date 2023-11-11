// this shows the admins login
// modules required for the admin login
const collection = require("../../models/admin/adminDatabase");
const reportCollection = require("../../models/reports/reportDetails")

// for rendering the admin page
exports.getAdminPage = async (req, res) => {
  const admin = req.session.admin;
  console.log("admin",admin);
  if (admin) {
    const report = await reportCollection.find().count();
    res.render("admin/admindashboard",{report});
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
