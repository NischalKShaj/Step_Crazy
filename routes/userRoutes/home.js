// requiring the modules for this page
const express = require("express");
const homeController = require("../../controller/usercontrols/homecontroller");
const signupController = require('../../controller/usercontrols/signupcontroller')
// setting the router for this page
const router = express.Router();

// getting the homepage
router.get("/", homeController.getHomePage);

// getting the loginpage
router.get("/login", homeController.getLoginPage);

// redirecting the homepage
router.post("/", homeController.postHomePage);

// getting the signup page
router.get("/signup", homeController.getSignupPage);

// redirecting to the login page
router.post('/login', homeController.postLoginPage)

// rendering the otp page
router.post('/otp',signupController.postOtpPage)

// redirecting the homepage
router.post("/", homeController.postHomePage);

// exporting the module to app.js
module.exports = router;
