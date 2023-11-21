// importing the modules for the wallet payment and showing the wallet details
const userCollection = require("../../models/user/userDatabase");
const productCollection = require("../../models/product/productDetails");
const cartCollection = require("../../models/cart/cartDetail");

// controller for getting the wallet page
exports.getWallet = async (req, res) => {
  try {
    const userEmail = req.session.user;
    const user = await userCollection.findOne({ email: userEmail }).exec();

    if (user && user.blocked === false) {
      const orders = user.order;

      if (orders && orders.length > 0) {
        // Create an array to store all product details
        const allOrderDetails = [];

        // Filter orders where paymentMethod is "wallet"
        const walletOrders = orders.filter(
          (order) => order.paymentMethod === "wallet"
        );

        for (const order of walletOrders) {
          // Assuming each order has an array of product IDs in the "products" field
          const productIds = order.products;

          // Use populate to retrieve product details for each product ID
          const orderDetails = await productCollection
            .find({ _id: { $in: productIds } })
            .exec();
          allOrderDetails.push(orderDetails);
        }
        res.render("user/wallet", {
          user,
          orders: walletOrders, // Pass the filtered wallet orders
          orderDetails: allOrderDetails,
        });
      } else {
        res.redirect("/");
      }
    } else {
      res.redirect("/");
    }
  } catch (error) {
    res.render("error/500");
  }
};
