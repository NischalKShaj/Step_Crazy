// requiring the modules for the files

const express = require("express");
const router = express.Router();

const homecontroller = require("../../controller/admincontroller/logincontroller");
const loginController = require("../../controller/admincontroller/homecontroller");
const productController = require("../../controller/admincontroller/productController");
const userController = require("../../controller/admincontroller/userController");
const categoryController = require("../../controller/admincontroller/categoryController");

// router for getting the admin login page
router.get("/", homecontroller.getAdminPage);

// router for getting the admin dashboard
router.get("/dashboard", loginController.getAdminHome);

// router for posting the admin dashboard
router.post("/dashboard", loginController.postAdminHome);

// router for getting the admin page
router.get("/dashboard/admins", loginController.getAdmin);

// router for puttng the value in the admins page
router.post("/dashboard/admins", loginController.postAdmin);

// router for adding a new admin
router.get("/dashboard/admins/add", loginController.getAdminAdd);

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

// router for adding the new product
router.get("/dashboard/product/add", productController.getAddProduct);

// router for editing the existing product
router.get("/dashboard/product/edit/:id", productController.getEditProduct);

// router for updating the product
router.post(
  "/dashboard/product/update/:id",
  productController.uploads,
  productController.postUpdateProduct
);

// router for getting the category page
router.get("/dashboard/category", categoryController.getCategoryPage);

// router for posting the category page
router.post("/dashboard/category", categoryController.postCategory);

// router for adding new category
router.get("/dashboard/category/add", categoryController.getCategoryAdd);

// router for editing the category
router.get("/dashboard/category/edit/:id", categoryController.getEditCategory);

module.exports = router;
