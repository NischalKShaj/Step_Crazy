// requiring the modules for the file
const mongoose = require("mongoose");
const userCollection = require("../../models/user/userDatabase");
const productCollection = require("../../models/product/productDetails");
const wishlistCollection = require("../../models/wishlist/wishlistDetail");

const User = mongoose.model("userCollection");
// controllers for the file

// controller for showing the product in the wishlist
exports.getWishlist = async (req, res) => {
  res.render("user/wishlist");
};

// controller for adding the product in the wishlist
exports.addToWishlist = async (req, res) => {
  const userEmail = req.session.user;
  const productId = req.params.id;

  try {
    const userDetail = await User.findOne({ email: userEmail });
    if (!userDetail) {
      res.redirect("/login");
    }
    const productSpec = await productCollection.find({ _id: productId });
    console.log("productDetail", productSpec);
    console.log("user:", userDetail);
    const userId = userDetail._id;
    const wishlist = new wishlistCollection({
      user: userId,
      product: productId,
    });
    console.log("wishlist:", wishlist);
    await wishlist.save();
    res.render("user/wishlist");
  } catch (error) {
    res.render("error/404");
  }
};
