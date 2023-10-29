// ==================> order controller for showing the order details and the order history <===========

// importing the required modules
const cartCollection = require("../../models/cart/cartDetail");
const userCollection = require("../../models/user/userDatabase");
const productCollection = require("../../models/product/productDetails");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");
dotenv.config();

// for taking the id and key from the env files
const { razorpayIdKey, razorpaySecretKey } = process.env;

// creating an instance for the payment
const razorpay = new Razorpay({
  key_id: razorpayIdKey,
  key_secret: razorpaySecretKey,
});

// controller for validating the stock after cashondelivery
exports.postOrderPage = async (req, res) => {
  const userId = req.session.user;
  const status = "Pending";
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

    const selectedAddress = req.query.addresses.split(",");
    const paymentMethod = req.query.paymentMethod;
    console.log("paymentmethod", paymentMethod);

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
          status: status,
          selectedAddress: selectedAddress,
          paymentMethod: paymentMethod,
        });

        console.log("user.order", user.order);
      } else {
        res.status(400).json({ message: "Out of stock", type: "danger" });
        return;
      }

      console.log(
        `Stock for product with ID ${product} updated to ${newStock}.`
      );
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

// controller for validating the stock after onlinepayment
exports.postOnlineConfirm = async (req, res) => {
  const userId = req.session.user;
  const status = "Pending";
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

    const selectedAddress = req.query.addresses.split(",");
    const paymentMethod = req.query.paymentMethod;
    console.log("payment method", paymentMethod);

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
          status: status,
          selectedAddress: selectedAddress,
          paymentMethod: paymentMethod,
        });

        console.log("user.order", user.order);
      } else {
        res.status(400).json({ message: "Out of stock", type: "danger" });
        return;
      }

      console.log(
        `Stock for product with ID ${product} updated to ${newStock}.`
      );
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

// contoleller for validating the stock after wallet payment
exports.getWalletPayment = async (req, res) => {
  const userId = req.session.user;
  const status = "Pending";
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

    const selectedAddress = req.query.addresses.split(",");
    const paymentMethod = req.query.paymentMethod;
    console.log("payment method", paymentMethod);

    for (const cartItem of cart) {
      const { quantity, product } = cartItem;

      // Retrieve the current stock for the product
      const existingProduct = await productCollection.findOne({
        _id: product,
      });

      
      const wallet = user.wallet;
      // condition for checking whether the wallet is having less amount or not
      if (wallet <= existingProduct.price) {
        const message = "Your wallet is having insufficient amount";
        res.status(400).json({ message, type: "danger" });
        return;
      } else if (wallet >= existingProduct.price) {
        await userCollection.updateOne(
          { email: userId },
          { $inc: { wallet: -existingProduct.price } }
        );
      }

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
          status: status,
          selectedAddress: selectedAddress,
          paymentMethod: paymentMethod,
        });

        console.log("user.order", user.order);
      } else {
        res.status(400).json({ message: "Out of stock", type: "danger" });
        return;
      }

      console.log(
        `Stock for product with ID ${product} updated to ${newStock}.`
      );
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

// controller for doing the  onlinepayment
exports.postOnlinePayment = (req, res) => {
  const totalamount = req.body.totalAmount;
  console.log(totalamount);
  let options = {
    amount: totalamount * 100,
    currency: "INR",
  };

  razorpay.orders.create(options, function (err, order) {
    res.json({ order });
  });
};

// controller for rendering the order history page with status
exports.getOrderDetails = async (req, res) => {
  try {
    const userEmail = req.session.user;
    const user = await userCollection.findOne({ email: userEmail }).exec();

    if (user) {
      const orders = user.order;

      console.log("user.order", user.order);

      if (orders && orders.length > 0) {
        // Create an array to store all product details
        const allOrderDetails = [];

        for (const order of orders) {
          // Assuming each order has an array of product IDs in the "products" field
          const productIds = order.products;

          console.log("productId", productIds);

          // Use populate to retrieve product details for each product ID
          const orderDetails = await productCollection
            .find({ _id: { $in: productIds } })
            .exec();
          console.log("orderdetails", orderDetails);

          allOrderDetails.push(orderDetails);
        }

        console.log("allorderdetails", allOrderDetails);

        res.render("user/orderHistory", {
          orders: orders,
          orderDetails: allOrderDetails,
        });
      } else {
        console.log("No orders found for the user");
        res.redirect("/");
      }
    } else {
      console.log("User not found");
      res.redirect("/");
    }
  } catch (error) {
    console.error("Error while fetching order details:", error);
    res.render("error/404");
  }
};

// controller for cancelling the order
exports.postCancelOrder = async (req, res) => {
  const userId = req.session.user;
  let user;
  const orderId = req.params.id;
  try {
    const filter = { "order._id": orderId };

    const update = { $set: { "order.$.status": "Cancel" } };

    const result = await userCollection.updateOne(filter, update);

    const order = await userCollection
      .findOne(filter)
      .populate({ path: "order.products" });

    // Filter the order array to get the specific order by order ID
    const specificOrder = order.order.find((order) =>
      order._id.equals(orderId)
    );
    console.log("specificOrder", specificOrder);
    console.log("order", order);

    const payment = specificOrder.paymentMethod;
    const product = specificOrder.products[0];
    const price = specificOrder.quantity * product.price;
    console.log("price",price);
    
    console.log("payment", payment);
    if (payment == "onlinepayment") {
      console.log("hello");
      user = await userCollection.updateOne(
        { email: userId },
        { $inc: { wallet: price } }
      );
    }

    console.log("Order status updated to Cancel successfully");
    res.redirect("/order");
  } catch (error) {
    console.error("An unexpected error occurred", error);
    res.render("error/404");
  }
};

// controller for getting the invoice of the product
exports.getOrderInvoice = async (req, res) => {
  try {
    const orderId = req.params.id;

    const invoiceDetails = await userCollection
      .findOne({ "order._id": orderId })
      .populate({
        path: "order.products",
      });

    // Filter the order array to get the specific order by order ID
    const specificOrder = invoiceDetails.order.find((order) =>
      order._id.equals(orderId)
    );

    // Create a new object with the user details and the specific order
    const invoiceData = {
      _id: invoiceDetails._id,
      first_name: invoiceDetails.first_name,
      last_name: invoiceDetails.last_name,
      email: invoiceDetails.email,
      phone: invoiceDetails.phone,
      gender: invoiceDetails.gender,
      address: invoiceDetails.address,
      order: [specificOrder],
    };

    res.render("user/invoice", { invoiceDetails: invoiceData });
  } catch (error) {
    console.error(
      "An unexpected error occurred while generating the invoice",
      error
    );
    res.render("error/404");
  }
};
