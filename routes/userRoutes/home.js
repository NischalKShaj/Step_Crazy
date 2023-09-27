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

// rendering the otp page
router.post('/otp',signupController.postOtpPage)

router.get('/otp', signupController.getOtpPage)

router.post('/checkOtp', signupController.checkOtp)

// redirecting the homepage
router.post("/", loginController.postHomePage);

// exporting the module to app.js
module.exports = router;
