// requiring the modules for this page
const express = require("express");

// requiring the local modules
const homeController = require("../../controller/usercontroller/homeController");
const signupController = require("../../controller/usercontroller/signupController");
const loginController = require("../../controller/usercontroller/loginController");
const productController = require("../../controller/usercontroller/productController");
const ProfileController = require("../../controller/usercontroller/profileController");
const cartController = require("../../controller/usercontroller/cartController");
const orderController = require("../../controller/usercontroller/orderController");
const wishlistController = require("../../controller/usercontroller/wishlistController");
const walletController = require("../../controller/usercontroller/walletController");
const usersAuth = require("../../middleware/authentication/userAuth");

// setting the router for this page
const router = express.Router();

// getting the homepage
router.get("/", homeController.getHomePage);

// getting the loginpage
router.get("/login", homeController.getLoginPage);

// redirecting the homepage
router.post("/", loginController.postHomePage);

// redirecting to the homepage afterlogout
router.get("/logout", homeController.Logout);

// getting the signup page
router.get("/signup", homeController.getSignupPage);

// redirecting to the login page
router.post("/login", homeController.postLoginPage);

// redirecting the otp page
router.post("/otp", signupController.postOtpPage);

// rendering the otp page
router.get("/otp", signupController.getOtpPage);

// redirecting the loginpage after otp validation
router.post("/checkOtp", signupController.checkOtp);

// redirecting the homepage
router.post("/", loginController.postHomePage);

// rendering the forgetpassword page
router.get("/login/forgotpassword", loginController.getForgetPassword);

// rendering the otp page for forgot password
router.post("/login/passwordOTP", loginController.postOTP);

// redirecting to the login page after the otp is submitted
router.get("/login/passwordOTP", loginController.getOTP);

// redirecting to the loginpage after entering the otp
router.post("/forgotOtp", loginController.postForgotLogin);

// rendering the product page
router.get("/product", productController.getProductPage);

// rendering the product details page
router.get("/product/details/:id", productController.getProductDetail);

// rendering the user profile page
router.get("/profile", usersAuth.userAuth, ProfileController.getProfilePage);

// redirecting to the profile page
router.post("/profile", usersAuth.userAuth, ProfileController.postProfilePage);

// rendering the page for adding the user
router.get(
  "/profile/add-adderss",
  usersAuth.userAuth,
  ProfileController.getAddressAdd
);

// router for showing the users address
router.get(
  "/profile/address",
  usersAuth.userAuth,
  ProfileController.getAddressPage
);

// router for editing the address of the user
router.get(
  "/profile/address/edit/:id",
  usersAuth.userAuth,
  ProfileController.getAddressEdit
);

// router for showing the edited address of the user
router.post(
  "/profile/address/update/:id",
  ProfileController.reqAuth,
  ProfileController.postAddressEdit
);

// router for adding new address
router.post("/profile/save_address", ProfileController.postNewAddress);

// router for getting  the password changing page
router.get(
  "/profile/changePassword/:id",
  usersAuth.userAuth,
  ProfileController.getNewPassword
);

// router for changing the password
router.post(
  "/profile/changePassword/:id",
  usersAuth.userAuth,
  ProfileController.postNewPassword
);

// router for showing the edited user profile
router.get(
  "/profile/edit-profile/:id",
  ProfileController.reqAuth,
  ProfileController.getProfileEdit
);

// router for updating the user profile
router.post(
  "/profile/editProfile/:id",
  usersAuth.userAuth,
  ProfileController.postProfileEdit
);

// router for moving to the checkout page
router.get(
  "/product/cart/checkout",
  usersAuth.userAuth,
  cartController.getCheckout
);

// router for increasing and decreasing the stock
router.post(
  "/product/cart/update/:productId",
  usersAuth.userAuth,
  cartController.putStock
);

// router for adding new product to the cart
router.get("/product/cart/:id", usersAuth.userAuth, cartController.addProducts);

// router for getting the cart
router.get("/cart", usersAuth.userAuth, cartController.getCart);

// router for posting the cart
router.post("/cart", usersAuth.userAuth, cartController.postCart);

// router for deleting the items in the cart
router.get(
  "/cart/remove/:id",
  usersAuth.userAuth,
  cartController.deleteProduct
);

// router for posting the order page
router.get("/product/order", usersAuth.userAuth, orderController.postOrderPage);

// router for getting the order History page and the order status
router.get("/order", usersAuth.userAuth, orderController.getOrderDetails);

// router for the pagination and the details
router.get("/order/search", orderController.getOrderDetails);

// router for canceling the order
router.get("/order/:id", usersAuth.userAuth, orderController.postCancelOrder);

// router for returning the order
router.get(
  "/order/returnOrder/:id",
  usersAuth.userAuth,
  orderController.getReturnOrder
);

// router for getting the wishlist
router.get("/wishlist", usersAuth.userAuth, wishlistController.getWishlist);

// router for posting the wishlist
router.post("/wishlist", usersAuth.userAuth, wishlistController.postWishlist);

// router for adding the product in the wishlist
router.get(
  "/product/wishlist/:id",
  usersAuth.userAuth,
  wishlistController.addToWishlist
);

// router for removing the product from the wishlist
router.get(
  "/wishlist/remove/:id",
  usersAuth.userAuth,
  wishlistController.getRemoveProduct
);

// router for getting the invoice of the product
router.get("/invoice/:id", usersAuth.userAuth, orderController.getOrderInvoice);

// router for onlinepayment
router.post(
  "/onlinepayment",
  usersAuth.userAuth,
  orderController.postOnlinePayment
);

// router for posting the order confirmation page
router.post(
  "/product/order",
  usersAuth.userAuth,
  orderController.postOnlineConfirm
);

// router for wallet payment
router.get(
  "/product/order/wallet",
  usersAuth.userAuth,
  orderController.getWalletPayment
);

// router for getting the wallet page
router.get("/wallet", usersAuth.userAuth, walletController.getWallet);

// router for searching the products
router.get("/products/search", productController.getProductPage);

// router for getting the coupon page
router.get("/coupon", usersAuth.userAuth, orderController.getCoupon);

// router for posting the coupon details
router.post(
  "/product/cart/coupon",
  usersAuth.userAuth,
  orderController.checkCoupons
);

// router for deleting the coupon
router.post("/clear-coupon", usersAuth.userAuth, orderController.clearCoupon);

// router for showing the available offers
router.get(
  "/offers",
  usersAuth.userAuth,
  orderController.showOffers
);

// exporting the module to app.js
module.exports = router;
