// requiring the modules for this page
const express = require("express");
const homeController = require("../../controller/usercontrols/homecontroller");
const signupController = require("../../controller/usercontrols/signupcontroller");
const loginController = require("../../controller/usercontrols/logincontroller");
const productController = require("../../controller/usercontrols/productController");
const ProfileController = require("../../controller/usercontrols/profileController");
const cartController = require("../../controller/usercontrols/cartController");
const orderController = require("../../controller/usercontrols/orderController");

// setting the router for this page
const router = express.Router();

// getting the homepage
router.get("/", homeController.getHomePage);

// getting the loginpage
router.get("/login", homeController.getLoginPage);

// redirecting the homepage
router.post("/", loginController.postHomePage);

// redirecting to the homepage afterlogout
router.get("/logout", homeController.Logout);

// getting the signup page
router.get("/signup", homeController.getSignupPage);

// redirecting to the login page
router.post("/login", homeController.postLoginPage);

// redirecting the otp page
router.post("/otp", signupController.postOtpPage);

// rendering the otp page
router.get("/otp", signupController.getOtpPage);

// redirecting the loginpage after otp validation
router.post("/checkOtp", signupController.checkOtp);

// redirecting the homepage
router.post("/", loginController.postHomePage);

// rendering the forgetpassword page
router.get("/login/forgotpassword", loginController.getForgetPassword);

// rendering the otp page for forgot password
router.post("/login/passwordOTP", loginController.postOTP);

// redirecting to the login page after the otp is submitted
router.get("/login/passwordOTP", loginController.getOTP);

// redirecting to the loginpage after entering the otp
router.post("/forgotOtp", loginController.postForgotLogin);

// rendering the product page
router.get("/product", productController.getProductPage);

// rendering the product details page
router.get("/product/details/:id", productController.getProductDetail);

// rendering the user profile page
router.get("/profile", ProfileController.getProfilePage);

// redirecting to the profile page
router.post("/profile", ProfileController.postProfilePage);

// rendering the page for adding the user
router.get("/profile/add-adderss", ProfileController.getAddressAdd);

// router for showing the users address
router.get("/profile/address", ProfileController.getAddressPage);

// router for editing the address of the user
router.get("/profile/address/edit/:id", ProfileController.getAddressEdit);

// router for adding new address
router.post("/profile/save_address", ProfileController.postNewAddress);

// router for showing the eidt user profile
router.get("/profile/edit-profile/:id", ProfileController.getProfileEdit);

// router for updating the user profile
router.post("/profile/editProfile/:id", ProfileController.postProfileEdit);

// router for moving to the checkout page
router.get("/product/cart/checkout", cartController.getCheckout);

// router for adding new product to the cart
router.get("/product/cart/:id", cartController.addProducts);

// router for getting the cart
router.get("/cart", cartController.getCart);

// router for increasing and decreasing the stock
router.post("/product/cart/update/:productId", cartController.putStock);

// router for posting the order page
router.get("/product/order", orderController.postOrderPage);

// exporting the module to app.js
module.exports = router;
