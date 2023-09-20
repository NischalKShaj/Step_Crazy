// requiring the modules for this page
const express = require('express')

// setting the router for this page
const router = express.Router();

// getting the homepage
router.get('/',(req, res)=>{
    res.render('home');
})

// exporting the module to app.js
module.exports = router;