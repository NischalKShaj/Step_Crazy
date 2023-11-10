// ==================> order controller for showing the order details and the order history <===========

// importing the required modules
const cartCollection = require("../../models/cart/cartDetail");
const userCollection = require("../../models/user/userDatabase");
const productCollection = require("../../models/product/productDetails");
const couponCollection = require("../../models/coupons/couponCollection");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
const PDFDocument = require("pdfkit");

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
    const unUsedCoupons = user.unUsedCoupons;
    const usedCoupons = user.usedCoupons;
    if (!user) {
      console.log("User not found");
      return res.render("error/404");
    } else if (user && user.blocked === false) {
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

        // Calculate the product price
        let productPrice = existingProduct.price * quantity;

        // If a coupon code is provided in the request body, update the product price with the discount
        if (unUsedCoupons && unUsedCoupons.length > 0) {
          for (const unusedCoupon of unUsedCoupons) {
            const couponCode = unusedCoupon.coupons;
            console.log("Coupon Code:", couponCode);

            // Now you can use `couponCode` to look up the coupon in your collection
            const coupon = await couponCollection.findOne({ code: couponCode });
            console.log("Coupon:", coupon);
            if (coupon) {
              const discount = coupon.discount;
              productPrice = (productPrice * discount) / 100;

              // Mark the coupon as used in the user collection
              usedCoupons.push({ coupon: couponCode });
              unUsedCoupons.pop();
            }
          }
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
            price: productPrice,
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
    } else {
      res.redirect("/login");
    }
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
    const unUsedCoupons = user.unUsedCoupons;
    const usedCoupons = user.usedCoupons;

    if (!user) {
      console.log("User not found");
      return res.render("error/404");
    } else if (user && user.blocked === false) {
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

        // Calculate the product price
        let productPrice = existingProduct.price * quantity;

        // If a coupon code is provided in the request body, update the product price with the discount
        if (unUsedCoupons && unUsedCoupons.length > 0) {
          for (const unusedCoupon of unUsedCoupons) {
            const couponCode = unusedCoupon.coupons;
            console.log("Coupon Code:", couponCode);

            // Now you can use `couponCode` to look up the coupon in your collection
            const coupon = await couponCollection.findOne({ code: couponCode });
            console.log("Coupon:", coupon);
            if (coupon) {
              const discount = coupon.discount;
              productPrice = (productPrice * discount) / 100;

              // Mark the coupon as used in the user collection
              usedCoupons.push({ coupon: couponCode });
              unUsedCoupons.pop();
            }
          }
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
            price: productPrice,
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
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error message", error);
    res.render("error/404");
  }
};

// contoleller for validating the stock after wallet payment
exports.getWalletPayment = async (req, res) => {
  const userId = req.session.user;
  const status = "Pending";
  let totalPayment = 0; // Initialize the total payment variable

  try {
    const user = await userCollection.findOne({ email: userId });
    const unUsedCoupons = user.unUsedCoupons;
    const usedCoupons = user.usedCoupons;

    if (!user) {
      console.log("User not found");
      return res.render("error/404");
    } else if (user && user.blocked === false) {
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
        console.log("existingProduct", existingProduct);

        if (!existingProduct) {
          console.log(`Product with ID ${product} not found.`);
          continue;
        }

        // Calculate the product price
        let productPrice = existingProduct.price * quantity;

        // If a coupon code is provided in the request body, update the product price with the discount
        if (unUsedCoupons && unUsedCoupons.length > 0) {
          for (const unusedCoupon of unUsedCoupons) {
            const couponCode = unusedCoupon.coupons;
            console.log("Coupon Code:", couponCode);

            // Now you can use `couponCode` to look up the coupon in your collection
            const coupon = await couponCollection.findOne({ code: couponCode });
            console.log("Coupon:", coupon);
            if (coupon) {
              const discount = coupon.discount;
              productPrice = (productPrice * discount) / 100;

              // Mark the coupon as used in the user collection
              usedCoupons.push({ coupon: couponCode });
              unUsedCoupons.pop();
            }
          }
        }
        console.log("user.usedCoupons", user.usedCoupons);
        // Add the product price to the total payment
        totalPayment += productPrice;

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
            price: totalPayment,
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

      // Deduct the total payment from the user's wallet
      if (totalPayment > 0) {
        user.wallet -= totalPayment;
      }

      // Save the updated user document with the order details and used coupons
      await user.save();

      // Remove the cart items
      await cartCollection.deleteMany({ user: user._id });

      // Render the thank-you page with order details
      res.render("user/thank-you", {
        orderDetail: user.order,
      });
    } else {
      res.redirect("/login");
    }
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
    const search = req.query.search;
    const page = parseInt(req.query.page) || 1;
    const limit = 25;
    const userEmail = req.session.user;
    const user = await userCollection.findOne({ email: userEmail }).exec();

    const skip = (page - 1) * limit;

    if (user && user.blocked === false) {
      const orders = user.order;

      console.log("user.order", user.order);

      if (orders && orders.length > 0) {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        // Slice the orders array to get the orders for the current page
        const ordersForPage = orders.slice(startIndex, endIndex);

        // Create an array to store all product details
        const allOrderDetails = [];

        for (const order of ordersForPage) {
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
          orders: ordersForPage,
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
  if (userId) {
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
      const priceArray = specificOrder.price;
      const price = priceArray.reduce((total, amount) => total + amount, 0);
      console.log("price", price);

      console.log("payment", payment);
      if (payment == "onlinepayment" || payment == "wallet") {
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
  } else {
    res.redirect("/login");
  }
};

// controller for getting the invoice of the product
exports.getOrderInvoice = async (req, res) => {
  const user = req.session.user;
  if (user) {
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

      // Create a new PDF document
      const doc = new PDFDocument();

      // Set response headers to trigger a download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="invoice.pdf"`
      );

      // Pipe the PDF document to the response
      doc.pipe(res);

      // Add content to the PDF document
      doc.fontSize(16).text("Invoice Details", { align: "center" });
      doc.moveDown(1);
      doc.fontSize(10).text("Customer Details", { align: "center" });
      doc.text(`Order ID: ${orderId}`);
      doc.moveDown(0.3);
      doc.text(
        `Name: ${invoiceDetails.first_name} ${invoiceDetails.last_name}`
      );
      doc.moveDown(0.3);
      doc.text(`Email: ${invoiceDetails.email}`);
      doc.moveDown(0.3);
      doc.text(`Phone: ${invoiceDetails.phone}`);
      doc.moveDown(0.3);
      doc.text(`Gender: ${invoiceDetails.gender}`);
      doc.moveDown(0.3);
      doc.text(`Address: ${specificOrder.selectedAddress}`);
      doc.moveDown(2);
      doc.fontSize(10).text("Product Details", { align: "center" });
      doc.moveDown(1);
      doc.text(`Name: ${specificOrder.products[0].name}`);
      doc.moveDown(0.3);
      doc.text(`Detail: ${specificOrder.products[0].description}`);
      doc.moveDown(0.3);
      doc.text(`Quantity: ${specificOrder.quantity}`);
      doc.moveDown(0.3);
      doc.text(`Price: ${specificOrder.products[0].price}`);
      doc.moveDown(0.3);
      doc.fontSize(10).text("Payment Details", { align: "center" });
      doc.moveDown(1);
      doc.text(`Payment Method: ${specificOrder.paymentMethod}`);
      doc.moveDown(3);
      doc
        .fontSize(16)
        .text(
          "Thank you for choosing Step Crazy! We appreciate your support and are excited to have you as part of our footwear family."
        );
      doc.end();
    } catch (error) {
      console.error(
        "An unexpected error occurred while generating the invoice",
        error
      );
      res.render("error/404");
    }
  } else {
    res.redirect("/login");
  }
};

// controller for returning the product
exports.getReturnOrder = async (req, res) => {
  const userId = req.session.user;
  let user;
  const orderId = req.params.id;
  if (userId) {
    try {
      const filter = { "order._id": orderId };

      const update = { $set: { "order.$.status": "Returned" } };

      const result = await userCollection.updateOne(filter, update);

      const order = await userCollection
        .findOne(filter)
        .populate({ path: "order.products" });

      // Filter the order array to get the specific order by order ID
      const specificOrder = order.order.find((order) =>
        order._id.equals(orderId)
      );

      const payment = specificOrder.paymentMethod;
      const product = specificOrder.products[0];
      const priceArray = specificOrder.price;
      const price = priceArray.reduce((total, amount) => total + amount, 0);

      console.log("payment", payment);
      if (
        payment == "onlinepayment" ||
        payment == "wallet" ||
        payment == "cod"
      ) {
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
  } else {
    res.redirect("/login");
  }
};

// controller for getting the coupons page
exports.getCoupon = async (req, res) => {
  const userId = req.session.user;
  const user = await userCollection.findOne({ email: userId });
  const coupon = await couponCollection.find();
  try {
    if (user && user.blocked === false) {
      res.render("user/coupon", { coupon, user });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error("There is an error while showing the coupons", coupon);
    res.render("error/404");
  }
};

// controller for checking the coupons
exports.checkCoupons = async (req, res) => {
  const userId = req.session.user;
  const couponCode = req.body.code; // The coupon code entered by the user

  try {
    const user = await userCollection.findOne({ email: userId });
    const coupon = await couponCollection.findOne({ code: couponCode });

    if (user && user.blocked === false) {
      const unUsedCoupons = user.unUsedCoupons;
      if (unUsedCoupons && unUsedCoupons.length > 0) {
        unUsedCoupons.pop();
      }
      if (coupon) {
        if (
          user.usedCoupons &&
          user.usedCoupons.some(
            (usedCoupon) => usedCoupon.coupon === couponCode
          )
        ) {
          res.json({ success: false, message: "Coupon has already been used" });
        } else {
          // Check if the coupon is expired
          const expiryDate = new Date(coupon.expiryDate);
          const currentDate = new Date();

          if (expiryDate <= currentDate) {
            res.json({ success: false, message: "Coupon has expired" });
          } else {
            const userid = user._id;
            const cartItem = await cartCollection
              .find({ user: userid })
              .populate({ path: "product", model: "product" });

            // Calculate the total discount for the user's cart
            let amount = 0;
            for (const item of cartItem) {
              amount += item.quantity * item.product.price;
            }

            const discount = coupon.discount;
            const totalDiscount = (amount * discount) / 100;
            console.log("totalDiscount", totalDiscount);

            // Update the unUsedCoupons array
            unUsedCoupons.push({ coupons: couponCode });

            console.log("user.unUsedCoupons", unUsedCoupons);
            // Save the updated user document with used coupons
            await user.save();

            res.json({
              success: true,
              discountPercent: discount,
              amountAfterDiscount: totalDiscount,
            });
          }
        }
      } else {
        res.json({ success: false, message: "Invalid coupon code" });
      }
    } else {
      res.json({
        success: false,
        message: "User is blocked or not found",
      });
    }
  } catch (error) {
    console.error("There was an error while checking the coupon", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
