// =====================> controllers for getting the product <================ //

// modules required for the controllers
const couponCollection = require("../../models/coupons/couponCollection");

// controller for rendering the coupons page
exports.getCouponPage = async (req, res) => {
  try {
    const coupon = await couponCollection.find();
    console.log("coupon", coupon);
    res.render("admin/coupon", { coupon });
  } catch (error) {
    console.error("error while rendering the page", error);
    res.render("error/404");
  }
};

// controller for  getting the page for adding the coupons
exports.getCouponAdd = (req, res) => {
  res.render("admin/add_coupon");
};

// controller for adding the value in the coupons
exports.postCoupnPage = async (req, res) => {
  try {
    const couponData = {
      code: req.body.code,
      discount: req.body.discount,
      minAmount: req.body.minAmount,
      expiryDate: req.body.expiryDate,
      description: req.body.description,
    };
    await couponCollection.insertMany([couponData]);
    res.redirect("/admin/dashboard/coupon");
  } catch (error) {
    console.error("Unexpected error occured while inserting the value", error);
    res.render("error/404");
  }
};

// controller for editing the coupons
exports.editCoupon = (req, res) => {
  res.render("admin/edit_coupon");
};
