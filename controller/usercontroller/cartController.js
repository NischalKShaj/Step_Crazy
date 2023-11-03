// ==============> cart controller <==================

// modules for the cart
const mongoose = require("mongoose");
const cartCollection = require("../../models/cart/cartDetail");
const productCollection = require("../../models/product/productDetails");
const userCollection = require("../../models/user/userDatabase");

// for saving the products in the cart
const User = mongoose.model("userCollection");
const Product = mongoose.model("product");

exports.getCart = async (req, res) => {
  const userId = req.session.user;
  const user = await userCollection.findOne({ email: userId });

  try {
    if (user && user.blocked === false) {
      const userId = user._id;
      const cartItems = await cartCollection
        .find({ user: userId })
        .populate("product")
        .exec();

      res.render("user/cart", { cartItems });
    } else {
      console.error("User not found for email: " + userEmail);
      res.redirect("/login");
    }
  } catch (error) {
    console.error("error in routing ", error);
    res.redirect("/login");
  }
};

// controller for posting the products
exports.addProducts = async (req, res) => {
  try {
    const userEmail = req.session.user;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      console.error("User not found for email: " + userEmail);
      return res.redirect("/login");
    } else if (user && user.blocked === false) {
      const userId = user._id;
      const productId = new mongoose.Types.ObjectId(req.params.id);

      console.log("ProductId:", productId); // Log the productId

      // Verify that the product exists in the product collection
      const existingProduct = await productCollection.findOne({
        _id: productId,
      });

      if (!existingProduct) {
        console.log("Product not found.");
        // Handle the case when the product doesn't exist, e.g., display an error message.
        return res.redirect("/product");
      }

      console.log("Existing Product:", existingProduct); // Log existingProduct

      // Now you can add the product to the cart
      const existingCartItem = await cartCollection.findOne({
        user: userId,
        product: productId,
      });

      console.log("Existing Cart Item:", existingCartItem); // Log existingCartItem

      if (existingCartItem) {
        console.log("Product already available in the cart");
      } else {
        const cartItem = new cartCollection({
          user: userId,
          product: productId,
          quantity: req.body.quantity,
        });
        console.log("cartItem ", cartItem);
        await cartItem.save();
        console.log("Product added to the cart successfully");
      }

      const cartItems = await cartCollection
        .find({ user: userId })
        .populate("product")
        .exec();
      console.log("cartItems", cartItems);
      res.redirect("/cart");
    } else {
      res.redirect("/login");
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
        // user: userId,
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

// controleller for posting the cart
exports.postCart = (req, res) => {
  res.redirect("/cart");
};

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

// router for checkoutpage
exports.getCheckout = async (req, res) => {
  const address = req.session.user;

  if (!address) {
    console.log("User email not found in session.");
    return res.redirect("/login");
  }

  try {
    const user = await userCollection.findOne({ email: address });

    if (!user) {
      console.log("User not found in the database.");
      throw new Error("User not found");
    } else if (user && user.blocked === false) {
      const userId = user._id;
      console.log("userId", userId);

      let cartItem = await cartCollection
        .find({ user: userId })
        .populate({ path: "product", model: "product" });
      const useAdd = await userCollection.find({ email: address });

      console.log("cartItems", cartItem);
      console.log(useAdd);

      res.render("user/checkout", { address, useAdd, cartItem });

      // Clear cartItem after rendering the page
      cartItem = [];
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error while loading the checkout page:", error);
    res.redirect("/product");
  }
};

// controller for removing the content from the cart
exports.deleteProduct = async (req, res) => {
  try {
    const cartId = req.params.id;

    console.log(cartId);
    // Use the model to find the cart item that matches the user, product ID, and remove it
    const removedCartItem = await cartCollection.findOneAndRemove({
      _id: cartId,
    });
    console.log(cartId);
    console.log(removedCartItem);
    if (removedCartItem) {
      // The product was successfully removed from the cart
      console.log("Product successfully removed from the cart");
      console.log(removedCartItem);
    } else {
      // The product wasn't found in the cart
      console.log("Product not found in the cart");
    }

    res.redirect("/cart");
  } catch (error) {
    console.error("Error while removing the product", error);
    res.redirect("/cart");
  }
};
