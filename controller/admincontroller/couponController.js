// =====================> controllers for getting the product <================ //

// modules required for the controllers
const couponCollection = require("../../models/coupons/couponCollection");

// controller for rendering the coupons page
exports.getCouponPage = async (req, res) => {
  const admin = req.session.admin;
  if (admin) {
    try {
      const coupon = await couponCollection.find();
      console.log("coupon", coupon);
      res.render("admin/coupon", { coupon });
    } catch (error) {
      console.error("error while rendering the page", error);
      res.render("error/404");
    }
  } else {
    res.redirect("/admin");
  }
};

// controller for  getting the page for adding the coupons
exports.getCouponAdd = (req, res) => {
  const admin = req.session.admin;
  if (admin) {
    res.render("admin/add_coupon");
  } else {
    res.redirect("/admin");
  }
};

// controller for adding the value in the coupons
exports.postCoupnPage = async (req, res) => {
  const admin = req.session.admin;
  if (admin) {
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
      console.error(
        "Unexpected error occured while inserting the value",
        error
      );
      res.render("error/404");
    }
  } else {
    res.redirect("/admin");
  }
};

// controller for getting the edit page for the coupons
exports.getEditCoupon = (req, res) => {
  const admin = req.session.admin;
  if (admin) {
    const id = req.params.id;
    couponCollection
      .findById(id)
      .then((coupon) => {
        if (!coupon) {
          res.redirect("/admin/dashboard/coupon");
        } else {
          res.render("admin/edit_coupon", { coupon: coupon });
        }
      })
      .catch((error) => {
        console.log("Error finding the category....", error);
        res.render("error/404");
      });
  } else {
    res.redirect("/admin");
  }
};

// controller for updating the coupons
exports.postCouponUpdate = async (req, res) => {
  const admin = req.session.admin;
  if (admin) {
    try {
      const id = req.params.id;

      const updateCoupon = await couponCollection.findByIdAndUpdate(id, {
        code: req.body.code,
        discount: req.body.discount,
        description: req.body.description,
        expiryDate: req.body.expiryDate,
        minAmount: req.body.minAmount,
      });

      res.redirect("/admin/dashboard/coupon");
    } catch (error) {
      res.redirect("/admin/dashboard/coupon/edit/:id");
      console.log("There is an error while updating the values....", error);
    }
  } else {
    res.redirect("/admin");
  }
};

// controller for deleting the coupons
exports.deleteCoupon = async (req, res) => {
  const admin = req.session.admin;
  const couponId = req.params.couponId;
  console.log(couponId);
  if (admin) {
    try {
      // Find and remove the coupon by ID
      const deletedCoupon = await couponCollection.findByIdAndRemove(couponId);

      if (!deletedCoupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }

      console.log("Coupon is deleted successfully");
      return res.status(200).json({ message: "Coupon deleted successfully" });
    } catch (error) {
      console.error("Error in deleting the coupon", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.redirect("/admin");
  }
};
