// this shows the admins login
// modules required for the admin login
const collection = require("../../models/admin/adminDatabase");
require("dotenv").config();

// for rendering the admin page
exports.getAdminPage = (req, res) => {
  res.render("admin");
};

// exports.getAdminHome = (req, res) =>{
//   res.render('admindashboard')
// }

// setting the admin credentials
// const credentials = {
//   email: "nischalkshaj5@gmail.com",
//   password: "red",
// };

// exports.postAdminHome = (req, res) => {
//   console.log(req.body.email, req.body.password);
//   console.log(credentials.email, credentials.password);
//   const { email, password } = req.body;
//   if (email === "nischalkshaj5@gmail.com" && password === "red") {
//     console.log("inside the dashboard...");
//     res.redirect("/admin/dashboard");
//   } else {
//     console.log("inside the admin login");
//     res.redirect("/admin");
//   }
// };
