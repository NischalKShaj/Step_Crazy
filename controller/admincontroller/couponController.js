// =====================> controllers for getting the product <================ //

// modules required for the controllers
const couponCollection = require("../../models/coupons/couponCollection");

// controller for rendering the coupons page
exports.getCouponPage = async (req, res) => {
  const admin = req.session.admin;

  try {
    if (admin) {
      const page = parseInt(req.query.page) || 1;
      const ITEMS_PER_PAGE = 5;
      const skip = (page - 1) * ITEMS_PER_PAGE;
      // Fetch coupon items with pagination
      const coupons = await couponCollection
        .find()
        .skip(skip)
        .limit(ITEMS_PER_PAGE)
        .exec();
      // Calculate total count of coupons for pagination
      const totalCount = await couponCollection.countDocuments();
      const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
      res.render("admin/coupon", { coupons, totalPages, currentPage: page });
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    res.render("error/500");
  }
};

// controller for  getting the page for adding the coupons
exports.getCouponAdd = (req, res) => {
  const admin = req.session.admin;
  if (admin) {
    res.render("admin/add_coupon", { error: null });
  } else {
    res.redirect("/admin");
  }
};

// controller for adding the value in the coupons
exports.postCoupnPage = async (req, res) => {
  const admin = req.session.admin;

  if (admin) {
    try {
      // Check if the coupon code already exists
      const existingCoupon = await couponCollection.findOne({
        code: req.body.code,
      });

      if (existingCoupon) {
        res.render("admin/add_coupon", { error: "Coupon already exists" });
      } else {
        // Coupon code doesn't exist, proceed with insertion
        const couponData = {
          code: req.body.code,
          discount: req.body.discount,
          minAmount: req.body.minAmount,
          maxAmount: req.body.maxAmount,
          flatDiscount: req.body.flatDiscount,
          expiryDate: req.body.expiryDate,
          description: req.body.description,
        };

        await couponCollection.insertMany([couponData]);
        res.redirect("/admin/dashboard/coupon");
      }
    } catch (error) {
      res.render("error/500");
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
        maxAmount: req.body.maxAmount,
        flatDiscount: req.body.flatDiscount,
      });

      await updateCoupon.save();

      res.redirect("/admin/dashboard/coupon");
    } catch (error) {
      res.redirect("/admin/dashboard/coupon/edit/:id");
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
      return res.status(200).json({ message: "Coupon deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.redirect("/admin");
  }
};
