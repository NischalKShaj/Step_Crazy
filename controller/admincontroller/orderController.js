// =============> Controller for order management <================

// importing the modules for the controller
const userCollection = require("../../models/user/userDatabase");
const productCollection = require("../../models/product/productDetails");
const cartCollection = require("../../models/cart/cartDetail");

// controller for getting the ordermanagement page
exports.getOrderPage = async (req, res) => {
  const admin = req.session.admin;
  // const page = parseInt(req.query.page) || 1;
  // const limit = 25;
  if (admin) {
    try {
      const id = req.params.id;
      const user = await userCollection.findOne({ _id: id }).exec();

      if (user) {
        const orders = user.order;

        console.log("user.order", user.order);

        if (orders && orders.length > 0) {
          // const startIndex = (page - 1) * limit;
          // const endIndex = startIndex + limit;

          // Slice the orders array to get the orders for the current page
          // const ordersForPage = orders.slice(startIndex, endIndex);
          // Create an array to store all product details

          const allOrderDetails = [];

          for (const order of orders) {
            // Assuming each order has an array of product IDs in the "products" field
            const productIds = order.products;
            const orderId = order._id;
            console.log("orderId", orderId);
            console.log("productId", productIds);

            // Use populate to retrieve product details for each product ID
            const orderDetails = await productCollection
              .find({ _id: { $in: productIds } })

              .exec();
            console.log("orderdetails", orderDetails);

            allOrderDetails.push(orderDetails);
          }

          console.log("allorderdetails", allOrderDetails);
          console.log("orders", orders);

          res.render("admin/orderManagement", {
            orders: orders,
            orderDetails: allOrderDetails,
          });
        } else {
          console.log("No orders found for the user");
          res.render("error/404");
        }
      } else {
        console.log("User not found");
        res.render("error/404");
      }
    } catch (error) {
      console.error("Error while fetching order details:", error);
      res.render("error/404");
    }
  } else {
    res.redirect("/admin");
  }
};

// controller for updating the sataus of the order
exports.getUpdateStatus = async (req, res) => {
  const admin = req.session.admin;
  const orderId = req.params.id;
  const newStatus = req.body.status;
  if (admin) {
    try {
      const filter = { "order._id": orderId };

      const update = { $set: { "order.$.status": newStatus } };

      const result = await userCollection.updateOne(filter, update);

      console.log("Order status updated successfully");
      res.redirect("/admin/dashboard/user");
    } catch (error) {
      console.error("An unexpected error occurred", error);
      res.render("error/404");
    }
  } else {
    res.redirect("/admin");
  }
};
