// ==================> order controller for showing the order details and the order history <===========

// importing the required modules
const cartCollection = require("../../models/cart/cartDetail");
const userCollection = require("../../models/user/userDatabase");
const productCollection = require("../../models/product/productDetails");

// router for gettting the order confirmation page
exports.postOrderPage = async (req, res) => {
  const userId = req.session.user;

  try {
    const user = await userCollection.findOne({ email: userId });
    if (!user) {
      console.log("inside the user error");
      return res.render("error/404");
    }

    // Retrieve the user's cart
    const cart = await cartCollection
      .findOne({ user: user._id })
      .populate({ path: "product", populate: { path: "image" } });

    console.log("Cart of the products", cart);
    if (!cart) {
      console.log("inside the cart error");
      return res.render("error/404");
    }

    // Create the order document
    const order = {
      cart: Array.isArray(cart) ? cart : [cart],
    };

    const cartItemsCopy = Array.isArray(order.cart)
      ? [...order.cart]
      : [order.cart];


    for (const cartItem of order.cart) {
      const { quantity, product: productID } = cartItem;

      // Retrieve the current stock for the product
      const existingProduct = await productCollection.findOne({
        _id: productID,
      });
      if (!existingProduct) {
        console.log(`Product with ID ${productID} not found.`);
        continue;
      }

      const currentStock = existingProduct.stock;

      // Calculate the new stock after subtracting the quantity
      const newStock = currentStock - quantity;

      // Check if the stock is not negative and the requested quantity is available
      if (newStock >= 0 && quantity <= currentStock) {
        await productCollection.updateOne(
          { _id: productID },
          { $set: { stock: newStock } }
        );
      } else {
        res.status(400).json({ message: "Out of stock", type: "danger" });
        return;
      }

      console.log(
        `Stock for product with ID ${productID} updated to ${newStock}.`
      );
    }

    // Get the product details from the populated order
    const orderDetail = Array.isArray(order.cart)
      ? [...order.cart]
      : [order.cart];

    console.log("Order", order);
    // Add the order to the user collection
    user.order.push({ cart: cartItemsCopy });

    // Remove the content from the cart
    // await cartCollection.deleteOne({ user: user._id });

    // Save the contents in the user collection
    await user.save();

    console.log("Order details", orderDetail);
    async function removeAllData() {
      try {
        const result = await cartCollection.deleteMany({});
        console.log("All documents removed from the cart collection.");
        console.log("Order after push", user.order);
      } catch (error) {
        console.error("Error while deleting documents:", error);
      }
    }

    // Call the function to delete all documents from the StepCrazy collection
    removeAllData();

    res.render("user/thank-you", {
      orderDetail: cartItemsCopy,
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

      const orderDetails = await userCollection
        .find({ email: userEmail })
        .populate({
          path: "order",
          populate: {
            path: "cart",
            populate: {
              path: "product",
              model: "product",
            },
          },
        })
        .exec();

      if (orderDetails) {
        // Process the data before rendering
        const processedOrders = orderDetails.map((order) => ({
          _id: order._id,
          date: order.created, // Assuming date is stored in the 'created' field
          cart: order.order[0].cart, // Assuming the order is in the first element of the order array
        }));
        console.log("processedOrders :-", processedOrders);
        res.render("user/orderHistory", { orders: processedOrders });
      } else {
        console.log("Orders not found");
        res.redirect("/"); // Redirect to a suitable page when orders are not found
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
