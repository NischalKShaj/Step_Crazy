// <======== handling the homecontrollers ===========>

const collection = require("../../models/user/userDatabase");
const cartCollection = require("../../models/cart/cartDetail");
// getting the homepage
exports.getHomePage = async (req, res) => {
  const user = req.session.user;
  const data = await collection.findOne(
    { email: user },
    { first_name: 1, _id: 0 }
  );
  // for adding the bannerslides
  const banner = [{ image }];
  const cart = await cartCollection.find({}, { quantity: 1, _id: 0 });
  console.log(data, user, cart);
  res.render("home/home", { data, user, cart, banner });
};

// getting the loginpage
exports.getLoginPage = (req, res) => {
  const invalid = req.query.success;
  console.log(invalid);
  res.render("user/login", { invalid });
};

// getting the signup page
exports.getSignupPage = (req, res) => {
  const invalid = req.query.success;
  res.render("user/signup", { invalid });
};

// redirectiong the loginpage
exports.postLoginPage = (req, res) => {
  res.redirect("/login");
};

// loging out the user successfully
exports.Logout = (req, res) => {
  req.session.user = null;
  res.redirect("/");
  console.log("Logout successful");
};
