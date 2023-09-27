// requiring the modules for this page
const express = require("express");
const homeController = require("../../controller/usercontrols/homecontroller");
const signupController = require('../../controller/usercontrols/signupcontroller')
const loginController  = require('../../controller/usercontrols/logincontroller')

// setting the router for this page
const router = express.Router();

// getting the homepage
router.get("/", homeController.getHomePage);

// getting the loginpage
router.get("/login", homeController.getLoginPage);

// redirecting the homepage
router.post("/", loginController.postHomePage);

// getting the signup page
router.get("/signup", homeController.getSignupPage);

// redirecting to the login page
router.post('/login', homeController.postLoginPage)

// redirecting the otp page
router.post('/otp',signupController.postOtpPage)

// rendering the otp page
router.get('/otp', signupController.getOtpPage)

// redirecting the loginpage after otp validation
router.post('/checkOtp', signupController.checkOtp)

// redirecting the homepage
router.post("/", loginController.postHomePage);

// rendering the product page 
router.get('/product' ,homeController.getProductPage)

// exporting the module to app.js 
module.exports = router;
