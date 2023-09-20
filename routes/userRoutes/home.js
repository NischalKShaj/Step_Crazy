// requiring the modules for this page
const express = require('express')
const homeController = require('../../controller/usercontrols/homecontroller')
// setting the router for this page
const router = express.Router();

// getting the homepage
router.get('/',homeController.getHomePage)

// exporting the module to app.js
module.exports = router;