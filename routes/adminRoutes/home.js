// requiring the modules for the files
const express = require("express");
const router = express.Router();

// requiring the local modules
const homecontroller = require("../../controller/admincontroller/loginController");
const loginController = require("../../controller/admincontroller/homeController");
const productController = require("../../controller/admincontroller/productController");
const userController = require("../../controller/admincontroller/userController");
const categoryController = require("../../controller/admincontroller/categoryController");
const orderController = require("../../controller/admincontroller/orderController");
const couponController = require("../../controller/admincontroller/couponController");
const adminAuth = require("../../middleware/authentication/adminAuth");

// router for getting the admin login page
router.get("/", homecontroller.getAdminPage);

// router for admin logout
router.get("/logout", homecontroller.Logout);

// router for getting the admin dashboard
router.get("/dashboard", loginController.getAdminHome);

// router for posting the admin dashboard
router.post("/dashboard", loginController.postAdminHome);

// router for getting the admin page
router.get("/dashboard/admins", adminAuth.adminAuth, loginController.getAdmin);

// router for puttng the value in the admins page
router.post(
  "/dashboard/admins",
  adminAuth.adminAuth,
  loginController.postAdmin
);

// router for adding a new admin
router.get(
  "/dashboard/admins/add",
  adminAuth.adminAuth,
  loginController.getAdminAdd
);

// router for getting the user page
router.get("/dashboard/user", adminAuth.adminAuth, userController.getUserPage);

// router for searching and pagination
router.get(
  "/dashboard/user/search",
  adminAuth.adminAuth,
  userController.getUserPage
);

// router for posting the user page
router.post(
  "/dashboard/user",
  adminAuth.adminAuth,
  userController.postUserPage
);

// router for blocking the user
router.post(
  "/dashboard/user/block-user/:userId",
  adminAuth.adminAuth,
  userController.postBlockeUser
);

// router for unblocking the user
router.post(
  "/dashboard/user/unblock-user/:userId",
  adminAuth.adminAuth,
  userController.postUnblockUser
);

// router for getting the product page
router.get(
  "/dashboard/product",
  adminAuth.adminAuth,
  productController.getProductPage
);

// router for searching and pagination of the product page
router.get(
  "/dashboard/product/search",
  adminAuth.adminAuth,
  productController.getProductPage
);

// router for posting the product page
router.post(
  "/dashboard/product",
  productController.uploads,
  productController.postProductPage
);

// router for adding the new product
router.get(
  "/dashboard/product/add",
  adminAuth.adminAuth,
  productController.getAddProduct
);

// router for editing the existing product
router.get(
  "/dashboard/product/edit/:id",
  adminAuth.adminAuth,
  productController.getEditProduct
);

// router for updating the product
router.post(
  "/dashboard/product/update/:id",
  productController.uploads,
  productController.postUpdateProduct
);

// router for deactivating the product
router.put(
  "/dashboard/product/deactivate/:productId",
  adminAuth.adminAuth,
  productController.putDeactivate
);

// router for activating the product
router.put(
  "/dashboard/product/activate/:productId",
  adminAuth.adminAuth,
  productController.putActivate
);

// router for deleting the product
router.get(
  "/dashboard/product/delete/:image/:ProductId",
  adminAuth.adminAuth,
  productController.deleteImage
);

// router for getting the category page
router.get(
  "/dashboard/category",
  adminAuth.adminAuth,
  categoryController.getCategoryPage
);

// router for getting the paginationa and searching the category
router.get(
  "/dashboard/category/search",
  adminAuth.adminAuth,
  categoryController.getCategoryPage
);

// router for posting the category page
router.post(
  "/dashboard/category",
  adminAuth.adminAuth,
  categoryController.postCategory
);

// router for adding new category
router.get(
  "/dashboard/category/add",
  adminAuth.adminAuth,
  categoryController.getCategoryAdd
);

// router for editing the category
router.get(
  "/dashboard/category/edit/:id",
  adminAuth.adminAuth,
  categoryController.getEditCategory
);

// router for updating the category
router.post(
  "/dashboard/category/update/:id",
  adminAuth.adminAuth,
  categoryController.postCategoryUpdate
);

// router for deleting the category
router.delete(
  "/dashboard/category/delete/:categoryId",
  adminAuth.adminAuth,
  categoryController.deleteCategory
);

// router for getting the order management page
router.get(
  "/dashboard/order/:id",
  adminAuth.adminAuth,
  orderController.getOrderPage
);

// router for pagination and searching
router.get(
  "/dashboard/order/:id/search",
  adminAuth.adminAuth,
  orderController.getOrderPage
);

// router for updating the order status
router.post(
  "/dashboard/order/status/:id",
  adminAuth.adminAuth,
  orderController.getUpdateStatus
);

// router for getting the coupon page
router.get(
  "/dashboard/coupon",
  adminAuth.adminAuth,
  couponController.getCouponPage
);

// router for getting the page for adding the coupon
router.get(
  "/dashboard/coupon/add",
  adminAuth.adminAuth,
  couponController.getCouponAdd
);

// router for posting the coupon page
router.post(
  "/dashboard/coupon",
  adminAuth.adminAuth,
  couponController.postCoupnPage
);

// router for editing the coupon
router.get(
  "/dashboard/coupon/edit/:id",
  adminAuth.adminAuth,
  couponController.getEditCoupon
);

// router for updating the coupon
router.post(
  "/dashboard/coupon/update/:id",
  adminAuth.adminAuth,
  couponController.postCouponUpdate
);

// router for deleting the coupon
router.delete(
  "/dashboard/coupon/delete/:couponId",
  adminAuth.adminAuth,
  couponController.deleteCoupon
);

module.exports = router;
