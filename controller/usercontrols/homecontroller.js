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

// rendering the product page
exports.getProductPage = (req, res) => {
  res.render('user/product')
};
// rendirecting the homepage
// exports.postHomePage = (req, res) => {
//   res.redirect("/");
// };
