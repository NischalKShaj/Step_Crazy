// ==================> order controller for showing the order details and the order history <===========

// importing the required modules
const cartCollection = require("../../models/cart/cartDetail");
const userCollection = require("../../models/user/userDatabase");
const productCollection = require("../../models/product/productDetails");
const couponCollection = require("../../models/coupons/couponCollection");
const reportCollection = require("../../models/reports/reportDetails");
const offerCollection = require("../../models/offer/offerDetails");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
const PDFDocument = require("pdfkit");
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");

pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
    let usedCoupons = []; // Create an array to track used coupons
    const Coupon = user.usedCoupons;

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

      // Calculate the total price of the cart
      let cartTotalPrice = 0;

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

        // Add the product price to the total
        cartTotalPrice += productPrice;

        const currentStock = existingProduct.stock;
        const newStock = currentStock - quantity;

        if (newStock >= 0 && quantity <= currentStock) {
          await productCollection.updateOne(
            { _id: product },
            { $set: { stock: newStock } }
          );
        } else {
          res.status(400).json({ message: "Out of stock", type: "danger" });
          return;
        }

        console.log(
          `Stock for product with ID ${product} updated to ${newStock}.`
        );
      }

      // Apply coupon to the entire cart
      if (unUsedCoupons && unUsedCoupons.length > 0) {
        for (const unusedCoupon of unUsedCoupons) {
          const couponCode = unusedCoupon.coupons;
          console.log("Coupon Code:", couponCode);

          // Now you can use `couponCode` to look up the coupon in your collection
          const coupon = await couponCollection.findOne({ code: couponCode });
          console.log("Coupon:", coupon);

          if (coupon) {
            const discount = coupon.discount;
            cartTotalPrice = (cartTotalPrice * discount) / 100;

            // Track the used coupon
            usedCoupons.push({ coupon: couponCode });
            Coupon.push({ coupon: couponCode });
            // Mark the coupon as used in the user collection
            unUsedCoupons.pop();
          }
        }
      } else {
        // If no coupon is applied, apply the offer based on the product category
        const cartProducts = await cartCollection
          .find({ user: user._id })
          .populate({ path: "product", model: "product" });

        for (const cartProduct of cartProducts) {
          const productCategory = cartProduct.product.category;

          // Modify the condition based on your criteria to select the offer
          const offer = await offerCollection.findOne({
            category: productCategory,
          });

          if (offer) {
            const discount = offer.discount;
            cartTotalPrice = cartTotalPrice - discount;
            break; // Break the loop after applying the first offer
          }
        }
      }

      // Add the cart and product details to the user's order
      const orderDetails = {
        cart: cart.map((item) => item._id),
        products: cart.map((item) => item.product),
        quantity: cart.map((item) => item.quantity),
        price: cartTotalPrice,
        status: status,
        selectedAddress: selectedAddress,
        paymentMethod: paymentMethod,
        usedCoupons: usedCoupons, // Add usedCoupons to orderDetails
      };

      user.order.push(orderDetails);

      // Save the updated user document with the order details
      await user.save();

      await userCollection.findOneAndUpdate(
        { email: user.email },
        { $inc: { cartQuantity: -user.cartQuantity } }
      );

      // entering the values inside the report collection
      const reportEntry = new reportCollection({
        orderDetails: [orderDetails],
      });
      console.log("reportEntry", reportEntry);

      // save the reports in the report collection
      await reportEntry.save();

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
    let usedCoupons = [];
    const Coupon = user.usedCoupons;

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

      let totalOrderPrice = 0; // Track the total order price

      for (const cartItem of cart) {
        const { quantity, product } = cartItem;

        const existingProduct = await productCollection.findOne({
          _id: product,
        });

        if (!existingProduct) {
          console.log(`Product with ID ${product} not found.`);
          continue;
        }

        let productPrice = existingProduct.price * quantity;
        totalOrderPrice += productPrice; // Accumulate the product prices

        const currentStock = existingProduct.stock;
        const newStock = currentStock - quantity;

        if (newStock >= 0 && quantity <= currentStock) {
          await productCollection.updateOne(
            { _id: product },
            { $set: { stock: newStock } }
          );
        } else {
          res.status(400).json({ message: "Out of stock", type: "danger" });
          return;
        }

        console.log(
          `Stock for product with ID ${product} updated to ${newStock}.`
        );
      }

      // Apply the coupon to the total order price
      if (unUsedCoupons && unUsedCoupons.length > 0) {
        for (const unusedCoupon of unUsedCoupons) {
          const couponCode = unusedCoupon.coupons;
          console.log("Coupon Code:", couponCode);

          const coupon = await couponCollection.findOne({ code: couponCode });
          console.log("Coupon:", coupon);
          if (coupon) {
            const discount = coupon.discount;
            totalOrderPrice = (totalOrderPrice * discount) / 100;

            Coupon.push({ coupon: couponCode });
            usedCoupons.push({ coupon: couponCode });
            unUsedCoupons.pop();
          }
        }
      } else {
        const cartProducts = await cartCollection
          .find({ user: user._id })
          .populate({ path: "product", model: "product" });

        for (const cartProduct of cartProducts) {
          const productCategory = cartProduct.product.category;

          // Modify the condition based on your criteria to select the offer
          const offer = await offerCollection.findOne({
            category: productCategory,
          });

          if (offer) {
            const discount = offer.discount;
            totalOrderPrice = totalOrderPrice - discount;
            break; // Break the loop after applying the first offer
          }
        }
      }

      // Now, 'totalOrderPrice' contains the discounted total order price

      // Add the order details to the user's order
      const orderDetails = {
        cart: cart.map((cartItem) => cartItem._id),
        products: cart.map((cartItem) => cartItem.product),
        quantity: cart.map((cartItem) => cartItem.quantity),
        price: totalOrderPrice, // Use the discounted total order price
        status: status,
        selectedAddress: selectedAddress,
        paymentMethod: paymentMethod,
        usedCoupons: usedCoupons,
      };

      user.order.push(orderDetails);

      const reportEntry = new reportCollection({
        orderDetails: [orderDetails],
      });

      await reportEntry.save();

      // Save the updated user document with the order details
      await user.save();

      await userCollection.findOneAndUpdate(
        { email: user.email },
        { $inc: { cartQuantity: -user.cartQuantity } }
      );

      // Remove the cart items
      await cartCollection.deleteMany({ user: user._id });

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
    let usedCoupons = [];
    const Coupon = user.usedCoupons;

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

      // Calculate the total product price for all products in the cart
      for (const cartItem of cart) {
        const { quantity, product } = cartItem;

        const existingProduct = await productCollection.findOne({
          _id: product,
        });

        if (!existingProduct) {
          console.log(`Product with ID ${product} not found.`);
          continue;
        }

        // Calculate the product price
        let productPrice = existingProduct.price * quantity;

        // Add the product price to the total payment
        totalPayment += productPrice;

        const currentStock = existingProduct.stock;
        const newStock = currentStock - quantity;

        if (newStock >= 0 && quantity <= currentStock) {
          await productCollection.updateOne(
            { _id: product },
            { $set: { stock: newStock } }
          );
        } else {
          res.status(400).json({ message: "Out of stock", type: "danger" });
          return;
        }

        console.log(
          `Stock for product with ID ${product} updated to ${newStock}.`
        );
      }

      // Apply the coupon discount to the total payment
      if (unUsedCoupons && unUsedCoupons.length > 0) {
        for (const unusedCoupon of unUsedCoupons) {
          const couponCode = unusedCoupon.coupons;
          console.log("Coupon Code:", couponCode);

          const coupon = await couponCollection.findOne({ code: couponCode });
          console.log("Coupon:", coupon);
          if (coupon) {
            const discount = coupon.discount;
            // Calculate the discount on the total payment
            totalPayment = (totalPayment * discount) / 100;

            // Mark the coupon as used in the user collection
            Coupon.push({ coupon: couponCode });
            usedCoupons.push({ coupon: couponCode });
            unUsedCoupons.pop();
          }
        }
      } else {
        const cartProducts = await cartCollection
          .find({ user: user._id })
          .populate({ path: "product", model: "product" });

        for (const cartProduct of cartProducts) {
          const productCategory = cartProduct.product.category;

          // Modify the condition based on your criteria to select the offer
          const offer = await offerCollection.findOne({
            category: productCategory,
          });

          if (offer) {
            const discount = offer.discount;
            totalPayment = totalPayment - discount;
            break; // Break the loop after applying the first offer
          }
        }
      }

      // Deduct the total payment from the user's wallet
      if (totalPayment > 0) {
        user.wallet -= totalPayment;
      }

      // Add the cart and product details to the user's order
      const details = {
        cart: cart.map((cartItem) => cartItem._id),
        products: cart.map((cartItem) => cartItem.product),
        quantity: cart.map((cartItem) => cartItem.quantity),
        price: totalPayment, // Use the discounted total payment
        status: status,
        selectedAddress: selectedAddress,
        paymentMethod: paymentMethod,
        usedCoupons: usedCoupons,
      };

      user.order.push(details);
      console.log("user.details", user.order);

      // entering the values inside the report collection
      const reportEntry = new reportCollection({
        orderDetails: [details],
      });
      console.log("reportEntry", reportEntry);

      // save the reports in the report collection
      await reportEntry.save();

      // Save the updated user document with the order details and used coupons
      await user.save();

      await userCollection.updateOne(
        { email: user.email },
        { $inc: { cartQuantity: -user.cartQuantity } }
      );
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
    const userEmail = req.session.user;
    const user = await userCollection.findOne({ email: userEmail }).exec();

    const page = parseInt(req.query.page) || 1;
    const limit = 7;

    if (user && user.blocked === false) {
      const orders = user.order;

      console.log("user.order", user.order);

      if (orders && orders.length > 0) {
        const totalCount = orders.length;
        const totalPages = Math.ceil(totalCount / limit);
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
          totalPages: totalPages,
          currentPage: page,
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

      const imagePath = "public/Img/login/logo.png"; // Change this to the path of your image
      const imageWidth = 100; // Adjust image width based on your layout
      const imageX = 550 - imageWidth; // Adjust X-coordinate based on your layout
      const imageY = 50; // Adjust Y-coordinate to place the image at the top
      doc.image(imagePath, imageX, imageY, { width: imageWidth });

      // Move to the next section after the image
      doc.moveDown(1);

      // Add content to the PDF document
      doc.fontSize(16).text("Billing Details", { align: "center" });
      doc.moveDown(1);
      doc.fontSize(10).text("Customer Details", { align: "center" });
      doc.text(`Order ID: ${orderId}`);
      doc.moveDown(0.3);
      doc.text(
        `Name: ${invoiceDetails.first_name || ""} ${
          invoiceDetails.last_name || ""
        }`
      );
      doc.moveDown(0.3);
      doc.text(`Email: ${invoiceDetails.email || ""}`);
      doc.moveDown(0.3);
      doc.text(`Phone: ${invoiceDetails.phone || ""}`);
      doc.moveDown(0.3);
      doc.text(`Gender: ${invoiceDetails.gender || ""}`);
      doc.moveDown(0.3);
      doc.text(`Address: ${specificOrder.selectedAddress || ""}`);
      doc.moveDown(0.3);
      doc.text(`Payment Method: ${specificOrder.paymentMethod || ""}`);

      // Display Used Coupons
      doc.moveDown(0.3);
      doc.text(`Used Coupons:`);
      specificOrder.usedCoupons.forEach((coupon) => {
        doc.text(`${coupon.coupon || "No coupons used"}`);
      });

      doc.moveDown(0.05);

      doc.fontSize(10).text("Product Details", { align: "center" });
      const headerY = 270; // Adjust this value based on your layout
      doc.font("Helvetica-Bold");
      doc.text("Name", 100, headerY, { width: 150, lineGap: 5 });

      doc.text("Quantity", 400, headerY, { width: 50, lineGap: 5 });
      doc.text("Price", 500, headerY, { width: 50, lineGap: 5 });
      doc.font("Helvetica");

      // Table rows
      const contentStartY = headerY + 20; // Adjust this value based on your layout
      let currentY = contentStartY;

      specificOrder.products.forEach((product, index) => {
        doc.text(product.name || "", 100, currentY, { width: 150, lineGap: 5 });

        doc.text(specificOrder.quantity[index] || "", 400, currentY, {
          width: 50,
          lineGap: 5,
        });
        doc.text(product.price || "", 500, currentY, {
          width: 50,
          lineGap: 5,
        });

        // Calculate the height of the current row and add some padding
        const lineHeight = Math.max(
          doc.heightOfString(product.name || "", { width: 150 }),
          doc.heightOfString(product.description || "", { width: 150 }),
          doc.heightOfString(specificOrder.quantity[index] || "", {
            width: 50,
          }),
          doc.heightOfString(product.price || "", { width: 50 })
        );
        currentY += lineHeight + 10; // Adjust this value based on your layout
      });
      doc.text(`Total Price: ${specificOrder.price || ""}`);

      // Set the y-coordinate for the "Thank you" section
      const separation = 50; // Adjust this value based on your layout
      const thankYouStartY = currentY + separation; // Update this line

      // Move to the next section
      doc.y = thankYouStartY; // Change this line

      // Move the text content in the x-axis
      const textX = 60; // Adjust this value based on your layout
      const textWidth = 500; // Adjust this value based on your layout
      doc
        .fontSize(16)
        .text(
          "Thank you for choosing Step Crazy! We appreciate your support and are excited to have you as part of our footwear family.",
          textX,
          doc.y,
          { align: "left", width: textWidth, lineGap: 10 }
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
  const ITEMS_PER_PAGE = 9;
  try {
    if (user && user.blocked === false) {
      const page = parseInt(req.query.page) || 1;
      const skip = (page - 1) * ITEMS_PER_PAGE;

      // Fetch coupon items with pagination
      const coupons = await couponCollection
        .find()
        .skip(skip)
        .limit(ITEMS_PER_PAGE)
        .exec();

      // Calculate total count of coupons for pagination
      const totalCount = await couponCollection.countDocuments();
      const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

      res.render("user/coupon", {
        coupons,
        user,
        totalPages,
        currentPage: page,
      });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error("There is an error while showing the coupons", error);
    res.render("error/500");
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

            // Check if the cart amount is greater than or equal to the minimum amount specified in the coupon
            if (amount < coupon.minAmount) {
              res.json({
                success: false,
                message:
                  "Cart amount does not meet the minimum requirement for this coupon",
              });
              return; // Exit the function early
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

// controller for the removing the coupons
exports.clearCoupon = async (req, res) => {
  const userId = req.session.user;
  const couponCode = req.query.couponCode;
  console.log("couponCode", couponCode);
  try {
    const user = await userCollection.findOne({ email: userId });
    const unUsedCoupons = user.unUsedCoupons;
    console.log("working", unUsedCoupons);
    //for extracting the coupon from the array unUsedCoupons
    const extractedCoupons = unUsedCoupons.map((coupon) => coupon.coupons);
    console.log("working", extractedCoupons);
    // checking the enterd couponcode and the extracted coupon code
    if (couponCode == extractedCoupons) {
      console.log("checking..");
      unUsedCoupons.pop();
    }
    // commiting the changes
    user.save();
    res.json({ success: true, extractedCoupons });
  } catch (error) {
    console.error(
      "There was an unexpected error while deleting the coupon",
      error
    );
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
