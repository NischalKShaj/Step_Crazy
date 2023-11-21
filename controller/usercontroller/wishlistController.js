// requiring the modules for the file
const mongoose = require("mongoose");
const userCollection = require("../../models/user/userDatabase");
const productCollection = require("../../models/product/productDetails");
const wishlistCollection = require("../../models/wishlist/wishlistDetail");

const User = mongoose.model("userCollection");
// controllers for the file

// controller for showing the product in the wishlist
exports.getWishlist = async (req, res) => {
  const userId = req.session.user;
  const user = await userCollection.findOne({ email: userId });
  const ITEMS_PER_PAGE = 9;
  try {
    if (!user) {
      res.redirect("/login");
    } else if (user && user.blocked === false) {
      const userId = user._id;
      const page = parseInt(req.query.page) || 1;
      const skip = (page - 1) * ITEMS_PER_PAGE;

      // Fetch wishlist items with pagination
      const wishlistItems = await wishlistCollection
        .find({ user: userId })
        .populate("product")
        .skip(skip)
        .limit(ITEMS_PER_PAGE)
        .exec();

      // Calculate total count of wishlist items for pagination
      const totalCount = await wishlistCollection.countDocuments({
        user: userId,
      });
      const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

      res.render("user/wishlist", {
        wishlistItems,
        totalPages,
        currentPage: page,
      });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.redirect("error/500");
  }
};

// controller for adding the product in the wishlist
exports.addToWishlist = async (req, res) => {
  const userEmail = req.session.user;
  const productId = req.params.id;

  try {
    const userDetail = await User.findOne({ email: userEmail });
    if (!userDetail) {
      res.redirect("/login");
    } else if (userDetail && userDetail.blocked === false) {
      const userId = userDetail._id;

      // Check if the product is already in the user's wishlist
      const existingWishlistItem = await wishlistCollection.findOne({
        user: userId,
        product: productId,
      });

      if (existingWishlistItem) {
        res.redirect("/product");
      } else {
        // Product is not in the wishlist, so add it
        const wishlist = new wishlistCollection({
          user: userId,
          product: productId,
        });
        await wishlist.save();

        const wishlistItems = await wishlistCollection
          .find({ user: userId })
          .populate("product")
          .exec();
        res.redirect("/wishlist");
      }
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.render("error/500");
  }
};

// controller for posting the wishlist
exports.postWishlist = (req, res) => {
  res.redirect("/wishlist");
};

// controller for removing the product from the wishlist
exports.getRemoveProduct = async (req, res) => {
  try {
    const wishlistId = req.params.id;
    const removeProduct = await wishlistCollection.findOneAndRemove({
      _id: wishlistId,
    });
    res.redirect("/wishlist");
  } catch (error) {
    res.render("error/500");
  }
};
