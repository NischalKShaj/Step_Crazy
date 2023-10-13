// ==============> cart controller <==================

// modules for the cart
const mongoose = require("mongoose");
const cartCollection = require("../../models/cart/cartDetail");
const productCollection = require("../../models/product/productDetails");
// const userCollection = require("../../models/user/userDatabase");

// for saving the products in the cart
const User = mongoose.model("userCollection"); // Replace "User" with your actual model name
const Product = mongoose.model("product");

exports.addProducts = async (req, res) => {
  try {
    // Get the user's email from the session
    const userEmail = req.session.user;

    // Find the user in the database based on the email
    const user = await User.findOne({ email: userEmail });

    if (user) {
      const userId = user._id;
      const productId = new mongoose.Types.ObjectId(req.params.id);

      // to check whether the product is already in the cart
      const existingProduct = await cartCollection.findOne({
        user: userId,
        product: productId,
      });
      // if the product is already available
      if (existingProduct) {
        console.log("product already available in the cart");
      } else {
        const cartItem = new cartCollection({
          // Create a new cart item
          user: userId,
          product: productId,
          quantity: req.body.quantity,
        });

        await cartItem.save();
        console.log("Product added to the cart successfully");
      }
      const cartPage = await cartCollection
        .find({ user: userId })
        .populate({
          path: "product",
          model: "product",
          populate: { path: "image" }, // Assuming 'image' is a field in your product collection
        })
        .exec();
      // console.log(cartPage, "run");
      res.render("user/cart", { cartPage });
    } else {
      console.error("User not found for email: " + userEmail);
      res.redirect("/product");
    }
  } catch (error) {
    console.error("Error adding the product to the cart:", error);
    res.redirect("/product");
  }
};

// function to increase the quantity and decrease the stock
async function increamentQuantity(productId) {
  try {
    const product = await productCollection.findById(productId);
    // const user = await userCollection.findById(userId);
    if (product) {
      product.stock -= 1;
      await product.save();
      const cartItem = await cartCollection.findOne({
        user: userId,
        product: productId,
      });
    }
  } catch (error) {
    console.error("Error while decreasing the stock", error);
  }
}

// function to decrease the quantity and increase the stock
async function decrementQuantity(productId, userId) {
  try {
    const product = await productCollection.findById(productId);
    if (product) {
      product.stock += 1;
      await product.save();
      const cartItem = await cartCollection.findOne({
        user: userId,
        product: productId,
      });
    }
  } catch (error) {
    console.error("Error while increasing the stock", error);
  }
}

// router for increasing and decreasing the product and decreasing the stock
exports.putStock = async (req, res) => {
  const productId = req.params.productId;
  const { plusCount, minusCount, cartId } = req.body;
  console.log(plusCount, minusCount, cartId);

  // Check if plusCount is defined
  if (plusCount !== undefined) {
    // Find the cart item by its _id
    const existingCartItem = await cartCollection.findById(cartId);
    if (existingCartItem) {
      // Update the quantity
      existingCartItem.quantity = plusCount;
      increamentQuantity(productId);
      // Save the updated cart item
      await existingCartItem.save();

      console.log("Updated quantity for cart item:", existingCartItem);
    } else {
      console.error("Cart item not found.");
    }
  } else if (minusCount !== undefined) {
    const existingCartItem = await cartCollection.findById(cartId);
    if (existingCartItem) {
      // Update the quantity
      existingCartItem.quantity = minusCount;
      decrementQuantity(productId);
      // Save the updated cart item
      await existingCartItem.save();

      console.log("Updated quantity for cart item:", existingCartItem);
    } else {
      console.error("Cart item not found.");
    }
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
