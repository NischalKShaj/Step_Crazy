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
const credentials = {
  email: "nischalkshaj5@gmail.com",
  password: "red",
};

exports.postAdminHome = (req, res) => {
  console.log(req.body.email, req.body.password);
  console.log(credentials.email, credentials.password);
  const { email, password } = req.body;
  if (email === "nischalkshaj5@gmail.com" && password === "red") {
    console.log("inside the dashboard...");
    res.render('admindashboard');
  } else {
    console.log("inside the admin login");
    res.redirect("/admin");
  }
};