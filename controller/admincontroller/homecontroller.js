// admin dashboard

// admin credentials 
const email = "nischalkshaj5@gmail.com";
const password = "red";


exports.getAdminHome = (req, res) =>{
  res.render('admin/admindashboard')
}

// for showing the admin dashboard
exports.postAdminHome = (req, res) => {
  try {
    console.log("running");

    const email1 = req.body.email;
    const password1 = req.body.password;
    console.log(email, password);

    if (email1 == email && password1 == password) {
      console.log("inside the dashboard...");
      res.redirect('/admin/dashboard');
    }
  } catch (err) {
    res.redirect("/admin");
  }
};


