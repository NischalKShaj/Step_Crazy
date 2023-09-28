// requiring the modules for the files

const express = require("express");
const router = express.Router();

const homecontroller = require("../../controller/admincontroller/logincontroller");
const loginController = require("../../controller/admincontroller/homecontroller");
const productController = require("../../controller/admincontroller/productController");

// router for getting the admin login page
router.get("/", homecontroller.getAdminPage);

// router for posting the admin dashboard
router.post("/dashboard", loginController.postAdminHome);

router.get("/dashboard/product", productController.getProductPage);

module.exports = router;
