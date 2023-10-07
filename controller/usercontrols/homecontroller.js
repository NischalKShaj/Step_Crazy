// <======== handling the homecontrollers ===========>

// getting the homepage
exports.getHomePage = (req, res) => {
  res.render("home/home");
};

// getting the loginpage
exports.getLoginPage = (req, res) => {
  res.render("user/login");
};

// getting the signup page
exports.getSignupPage = (req, res) => {
  res.render("user/signup");
};

// redirectiong the loginpage
exports.postLoginPage = (req, res) => {
  res.redirect("/login");
};

// loging out the user successfully
exports.postLogout = (req, res) => {
  res.status(200).json({ message: "User logged out successfully" });
  
  console.log("Logout successful");
};
