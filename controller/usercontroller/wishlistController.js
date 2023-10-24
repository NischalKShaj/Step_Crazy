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
  try {
    if (!user) {
      res.redirect("/login");
    }
    const userId = user._id;
    const wishlistItems = await wishlistCollection
      .find({ user: userId })
      .populate("product")
      .exec();
    res.render("user/wishlist", { wishlistItems });
  } catch (error) {
    // console.error("There is an unexpected error while showing the wishlist");
    res.redirect("error/404");
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
    }

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
  } catch (error) {
    res.render("error/404");
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
    if(removeProduct){
      console.log("Product removed succesefully", removeProduct);
    }
    res.redirect("/wishlist")
  } catch (error) {
    console.error("There is an error while removing the product from the cart");
    res.render("error/404");
  }
};
