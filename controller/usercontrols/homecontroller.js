// <======== handling the homecontrollers ===========>

// getting the homepage
exports.getHomePage = (req, res) => {
  res.render("home");
};

// getting the loginpage
exports.getLoginPage = (req, res) => {
  res.render("login");
};

// getting the signup page
exports.getSignupPage = (req, res) => {
  res.render("signup");
};

// rendirecting the homepage
exports.postHomePage = (req, res) => {
  res.redirect("/");
};
