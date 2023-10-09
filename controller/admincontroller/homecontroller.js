// <========================> admin dashboard <=========================>

// importing the modules for the data in the admins database
const collection = require("../../models/admin/adminDatabase");


let admin;

// for getting the admin dashboard
exports.getAdminHome = (req, res) => {
 

    res.redirect("/admin");
 
  
};

// for showing the admin dashboard
exports.postAdminHome = async (req, res) => {
  try{
    admin = await collection.findOne({
      email: req.body.email,
      password : req.body.password,
    })

    
    console.log(admin);
    if(admin.email === req.body.email && admin.password === req.body.password){
      req.session.admin = req.body.email;
      console.log("inside the dashboard...");
      res.redirect("/admin");
    } else{
      const message = "Invalid admin credentials"
      res.redirect(`/admin?success=${encodeURIComponent(message)}`);
    }
  } catch (err){
    const message = "Invalid admin credentials"
      res.redirect(`/admin?success=${encodeURIComponent(message)}`);
  }
};

// for showing the values in the admin page
exports.getAdmin = async (req, res) => {
  admin = await collection.find();
  res.render("admin/adminmanagement", { admin });
};

// for gettin the form for adding the new admn
exports.getAdminAdd = (req, res) => {
  res.render("admin/add_admin");
};

// for inserting the value in the admin database
exports.postAdmin = async (req, res) => {
  console.log(req.body.password);
  const admin = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  console.log(admin);
  await collection.insertMany([admin]);
  res.redirect("/admin/dashboard/admins");
};
