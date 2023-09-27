// admin dashboard

// // modules required for the admin login
// const collection = require("../../models/admin/adminDatabase");
// require('dotenv').config()

// const username = process.env.Admin_email
// const password = process.env.Admin_password

// exports.postAdminHome = (req, res) =>{
//     if(username === req.body.email && password === req.body.password){
//       res.render()
//     }
// }
const email = "nischalkshaj5@gmail.com";
const password = "red";

exports.postAdminHome = (req, res) => {
  try {
    console.log("running");

    const email1 = req.body.email;
    const password1 = req.body.password;
    console.log(email, password);

    if (email1 == email && password1 == password) {
      console.log("inside the dashboard...");
      res.render("admin/admindashboard");
    }
  } catch (err) {
    res.redirect("/admin");
  }
};
