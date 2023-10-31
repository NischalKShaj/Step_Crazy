// requiring the modules for the files

const express = require("express");
const router = express.Router();

const homecontroller = require("../../controller/admincontroller/logincontroller");
const loginController = require("../../controller/admincontroller/homecontroller");
const productController = require("../../controller/admincontroller/productController");
const userController = require("../../controller/admincontroller/userController");
const categoryController = require("../../controller/admincontroller/categoryController");
const orderController = require("../../controller/admincontroller/orderController");
const couponController = require("../../controller/admincontroller/couponController");

// router for getting the admin login page
router.get("/", homecontroller.getAdminPage);

// router for admin logout
router.get("/logout", homecontroller.Logout);

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

// router for blocking the user
router.post(
  "/dashboard/user/block-user/:userId",
  userController.postBlockeUser
);

// router for unblocking the user
router.post(
  "/dashboard/user/unblock-user/:userId",
  userController.postUnblockUser
);

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

// router for deactivating the product
router.put(
  "/dashboard/product/deactivate/:productId",
  productController.putDeactivate
);

// router for activating the product
router.put(
  "/dashboard/product/activate/:productId",
  productController.putActivate
);

// router for deleting the product
router.get(
  "/dashboard/product/delete/:image/:ProductId",
  productController.deleteImage
);

// router for getting the category page
router.get("/dashboard/category", categoryController.getCategoryPage);

// router for posting the category page
router.post("/dashboard/category", categoryController.postCategory);

// router for adding new category
router.get("/dashboard/category/add", categoryController.getCategoryAdd);

// router for editing the category
router.get("/dashboard/category/edit/:id", categoryController.getEditCategory);

// router for updating the category
router.post(
  "/dashboard/category/update/:id",
  categoryController.postCategoryUpdate
);

// router for deleting the category
router.delete(
  "/dashboard/category/delete/:categoryId",
  categoryController.deleteCategory
);

// router for getting the order management page
router.get("/dashboard/order/:id", orderController.getOrderPage);

// router for updating the order status
router.post("/dashboard/order/status/:id", orderController.getUpdateStatus);

// router for getting the coupon page
router.get("/dashboard/coupon", couponController.getCouponPage);

// router for getting the page for adding the coupon
router.get("/dashboard/coupon/add", couponController.getCouponAdd);

// router for posting the coupon page
router.post("/dashboard/coupon", couponController.postCoupnPage);

// router for editing the coupon
router.get("/dashboard/coupon/edit/:id", couponController.getEditCoupon);

// router for updating the coupon
router.post("/dashboard/coupon/update/:id", couponController.postCouponUpdate);

// router for deleting the coupon
router.delete(
  "/dashboard/coupon/delete/:couponId",
  couponController.deleteCoupon
);

module.exports = router;
