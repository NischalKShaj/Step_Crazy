// requiring the modules for the files

const express = require("express");
const router = express.Router();

const homecontroller = require("../../controller/admincontroller/logincontroller");
const loginController = require("../../controller/admincontroller/homecontroller");
const productController = require("../../controller/admincontroller/productController");
const userController = require("../../controller/admincontroller/userController");

// router for getting the admin login page
router.get("/", homecontroller.getAdminPage);

// router for getting the admin dashboard
router.get("/dashboard", loginController.getAdminHome);

// router for posting the admin dashboard
router.post("/dashboard", loginController.postAdminHome);

// router for getting the user page
router.get("/dashboard/user", userController.getUserPage);

// router for posting the user page
router.post("/dashboard/user", userController.postUserPage);

// router for getting the product page
router.get("/dashboard/product", productController.getProductPage);

// router for posting the product page
router.post(
  "/dashboard/product",
  productController.uploads,
  productController.postProductPage
);

// router for adding the new product in the page
router.get("/dashboard/product/add", productController.getAddProduct);

// router for editing the existing product
router.get("/dashboard/product/edit/", productController.getEditProduct);

module.exports = router;
