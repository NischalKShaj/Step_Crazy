// ==============> cart controller <==================

// modules for the cart
const mongoose = require("mongoose");
const cartCollection = require("../../models/cart/cartDetail");

// for saving the products in the cart
const User = mongoose.model("userCollection"); // Replace "User" with your actual model name

exports.addProducts = async (req, res) => {
  try {
    // Get the user's email from the session
    const userEmail = req.session.user;

    // Find the user in the database based on the email
    const user = await User.findOne({ email: userEmail });

    if (user) {
      const userId = user._id;
      const productId = new mongoose.Types.ObjectId(req.params.id);

      // Create a new cart item
      const cartItem = new cartCollection({
        user: userId,
        product: productId,
      });

      await cartItem.save();
      console.log("Product added to the cart successfully");
      const cartPage = await cartCollection
      .findOne({ user: id })
      .populate("product")
      .exec();
      res.render("user/cart");
     
    } else {
      console.error("User not found for email: " + userEmail);
      res.redirect("/product");
      
    }
  } catch (error) {
    console.error("Error adding the product to the cart:", error);
    res.redirect("/product");
    
  }
};

// route for the cart page uncomment at the time of redirecting
// exports.getCartProduct = async (req, res) => {
//   try {
//     const id = req.params.id;
//     console.log(id);
//     const cartPage = await cartCollection
//       .findOne({ user: id })
//       .populate("product")
//       .exec();
//     console.log(cartPage);
//     res.render("user/cart", { cartPage });
//   } catch (error) {
//     console.log("There is an error while rendering the cart page");
//   }
// };
