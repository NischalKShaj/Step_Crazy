// ==============> cart controller <==================

// modules for the cart
const mongoose = require("mongoose");
const cartCollection = require("../../models/cart/cartDetail");
const productCollection = require("../../models/product/productDetails");
const userCollection = require("../../models/user/userDatabase");
const couponCollection = require("../../models/coupons/couponCollection");

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
      res.redirect("/login");
    }
  } catch (error) {
    res.redirect("/login");
  }
};

// controller for posting the products
exports.addProducts = async (req, res) => {
  try {
    const userEmail = req.session.user;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.redirect("/login");
    } else if (user && user.blocked === false) {
      const userId = user._id;
      const productId = new mongoose.Types.ObjectId(req.params.id);

      // Verify that the product exists in the product collection
      const existingProduct = await productCollection.findOne({
        _id: productId,
      });

      if (!existingProduct) {
        
        // Handle the case when the product doesn't exist, e.g., display an error message.
        return res.redirect("/product");
      }

      // Now you can add the product to the cart
      const existingCartItem = await cartCollection.findOne({
        user: userId,
        product: productId,
      });
      if (existingCartItem) {
      } else {
        const cartItem = new cartCollection({
          user: userId,
          product: productId,
          quantity: req.body.quantity,
        });
        await userCollection.findOneAndUpdate(
          { email: user.email },
          { $inc: { cartQuantity: 1 } }
        );
        await cartItem.save();
      }

      const cartItems = await cartCollection
        .find({ user: userId })
        .populate("product")
        .exec();
      res.redirect("/cart");
    } else {
      res.redirect("/login");
    }
  } catch (error) {
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
    res.render("error/500");
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
    res.render("error/500");
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

  // Check if plusCount is defined
  if (plusCount !== undefined) {
    // Find the cart item by its _id
    const existingCartItem = await cartCollection.findById(cartId);
    if (existingCartItem) {
      // Update the quantity
      existingCartItem.quantity = plusCount;
      increamentQuantity(productId);
      // Save the updated cart item<
      await existingCartItem.save();
    }
  } else if (minusCount !== undefined) {
    const existingCartItem = await cartCollection.findById(cartId);
    if (existingCartItem) {
      // Update the quantity
      existingCartItem.quantity = minusCount;
      decrementQuantity(productId);
      // Save the updated cart item
      await existingCartItem.save();
    }
  }
};

// router for checkoutpage
exports.getCheckout = async (req, res) => {
  const address = req.session.user;

  if (!address) {
    return res.redirect("/login");
  }

  try {
    const user = await userCollection.findOne({ email: address });
    const coupon = await couponCollection.find();
    if (!user) {
      throw new Error("User not found");
    } else if (user && user.blocked === false) {
      const userId = user._id;
      const userEmail = user.email;

      // Validate stock before fetching cart items
      const cartItems = await cartCollection
        .find({ user: userId })
        .populate({ path: "product", model: "product" });

      for (const cartItem of cartItems) {
        const { quantity, product } = cartItem;

        // Retrieve the current stock for the product
        const existingProduct = await productCollection.findOne({
          _id: product,
        });

        if (!existingProduct) {
          throw new Error(`Product with ID ${product} not found.`);
        }

        // Validate if the product is still in stock
        if (quantity > existingProduct.stock) {
          throw new Error(`Product with ID ${product} is out of stock.`);
        }
      }

      let cartItem = await cartCollection
        .find({ user: userId })
        .populate({ path: "product", model: "product" });
      const useAdd = await userCollection.find({ email: address });

      res.render("user/checkout", { address, useAdd, cartItem, user, coupon });
      // Clear cartItem after rendering the page
      cartItem = [];
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.redirect("/product");
  }
};

// controller for removing the content from the cart
exports.deleteProduct = async (req, res) => {
  const userEmail = req.session.user;
  const user = await userCollection.findOne({ email: userEmail });
  try {
    const cartId = req.params.id;
    // Use the model to find the cart item that matches the user, product ID, and remove it
    const removedCartItem = await cartCollection.findOneAndRemove({
      _id: cartId,
    });
    await userCollection.updateOne(
      { email: userEmail },
      { $inc: { cartQuantity: -1 } }
    );
    res.redirect("/cart");
  } catch (error) {
    res.redirect("/cart");
  }
};
