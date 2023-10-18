// ==================> order controller for showing the order details and the order history <===========

// importing the required modules
const cartCollection = require("../../models/cart/cartDetail");
const userCollection = require("../../models/user/userDatabase");
const productCollection = require("../../models/product/productDetails");

// router for gettting the order confirmation page
// exports.postOrderPage = async (req, res) => {
//   const userId = req.session.user;

//   try {
//     const user = await userCollection.findOne({ email: userId });
//     if (!user) {
//       console.log("User not found");
//       return res.render("error/404");
//     }

//     const cart = await cartCollection.find({ user: user._id });

//     if (!cart || cart.length === 0) {
//       console.log("Cart is empty");
//       return res.render("error/404");
//     }

//     const orderItems = [];

//     for (const cartItem of cart) {
//       const { quantity, product } = cartItem;

//       // Retrieve the current stock for the product
//       const existingProduct = await productCollection.findOne({
//         _id: product,
//       });

//       if (!existingProduct) {
//         console.log(`Product with ID ${product} not found.`);
//         continue;
//       }

//       const currentStock = existingProduct.stock;
//       const newStock = currentStock - quantity;

//       if (newStock >= 0 && quantity <= currentStock) {
//         await productCollection.updateOne(
//           { _id: product },
//           { $set: { stock: newStock } }
//         );

//         // Add the cart and product details to orderItems
//         orderItems.push({
//           cart: cartItem._id,
//           product,
//           quantity,
//         });
//         console.log("orderItems.push",orderItems);
//       } else {
//         res.status(400).json({ message: "Out of stock", type: "danger" });
//         return;
//       }

//       console.log(
//         `Stock for product with ID ${product} updated to ${newStock}.`
//       );
//     }

//     // Create the order document
//     const order = {
//       cart:cart._id,
//       product,
//     };

//     console.log("order", order);

//     // Add the order to the user collection
//     user.order.push(order);

//     console.log("user.order",user.order);

//     // Save the contents in the user collection
//     await user.save();

//     // Remove the cart items
//     await cartCollection.deleteMany({ user: user._id });

//     // Render the thank-you page with order details
//     res.render("user/thank-you", {
//       orderDetail: orderItems,
//     });
//   } catch (error) {
//     console.error("Error message", error);
//     res.render("error/404");
//   }
// };

exports.postOrderPage = async (req, res) => {
  const userId = req.session.user;

  try {
    const user = await userCollection.findOne({ email: userId });
    if (!user) {
      console.log("User not found");
      return res.render("error/404");
    }

    const cart = await cartCollection.find({ user: user._id });

    if (!cart || cart.length === 0) {
      console.log("Cart is empty");
      return res.render("error/404");
    }

    for (const cartItem of cart) {
      const { quantity, product } = cartItem;

      // Retrieve the current stock for the product
      const existingProduct = await productCollection.findOne({
        _id: product,
      });

      if (!existingProduct) {
        console.log(`Product with ID ${product} not found.`);
        continue;
      }

      const currentStock = existingProduct.stock;
      const newStock = currentStock - quantity;

      if (newStock >= 0 && quantity <= currentStock) {
        await productCollection.updateOne(
          { _id: product },
          { $set: { stock: newStock } }
        );

        // Add the cart and product details to the user's order
        user.order.push({
          cart: cartItem._id,
          products: product,
          quantity,
        });

        console.log("user.ordre",user.order);
      } else {
        res.status(400).json({ message: "Out of stock", type: "danger" });
        return;
      }

      console.log(`Stock for product with ID ${product} updated to ${newStock}.`);
    }

    // Save the updated user document with the order details
    await user.save();

    // Remove the cart items
    await cartCollection.deleteMany({ user: user._id });

    // Render the thank-you page with order details
    res.render("user/thank-you", {
      orderDetail: user.order,
    });
  } catch (error) {
    console.error("Error message", error);
    res.render("error/404");
  }
};


// controller for rendering the order history page with status
exports.getOrderDetails = async (req, res) => {
  try {
    const userEmail = req.session.user;
    const user = await userCollection.findOne({ email: userEmail }).exec();

    if (user) {
      const orders = user.order;

      if (orders && orders.length > 0) {
        // Assuming you want to show all orders for the user
        res.render("user/orderHistory", { orders: orders });
      } else {
        console.log("No orders found for the user");
        res.redirect("/"); // Redirect to a suitable page when no orders are found
      }
    } else {
      console.log("User not found");
      res.redirect("/"); // Redirect to a suitable page when the user is not found
    }
  } catch (error) {
    console.error("Error while fetching order details:", error);
    res.render("error/404"); // Redirect on error
  }
};
