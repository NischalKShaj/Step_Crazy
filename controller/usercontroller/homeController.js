// <======== handling the homecontrollers ===========>

const collection = require("../../models/user/userDatabase");
const cartCollection = require("../../models/cart/cartDetail");
const bannerCollection = require("../../models/banner/bannerDetail");

// getting the homepage
exports.getHomePage = async (req, res) => {
  try {
    const user = req.session.user;
    const data = await collection.findOne(
      { email: user },
      { first_name: 1, cartQuantity: 1, _id: 0 }
    );

    // Fetch banner data from the database
    const bannerData = await bannerCollection.find({}, { _id: 0 });

    const cart = await cartCollection.find({}, { quantity: 1, _id: 0 });
    res.render("home/home", { data, user, cart, bannerData });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
};

// getting the loginpage
exports.getLoginPage = (req, res) => {
  const message = req.query.success;
  res.render("user/login", { message });
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
};
