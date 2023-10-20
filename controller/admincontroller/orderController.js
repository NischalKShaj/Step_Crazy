// =============> Controller for order management <================

// importing the modules for the controller
const userCollection = require("../../models/user/userDatabase");
const productCollection = require("../../models/product/productDetails");
const cartCollection = require("../../models/cart/cartDetail");

// controller for getting the ordermanagement page
exports.getOrderPage = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userCollection.findOne({ _id: id }).exec();

    if (user) {
      const orders = user.order;

      console.log("user.order", user.order);

      if (orders && orders.length > 0) {
        // Create an array to store all product details
        const orderId = orders.id;
        console.log("orderId", orderId);
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

        res.render("admin/orderManagement", {
          orders: orders,
          orderDetails: allOrderDetails,
        });
      } else {
        console.log("No orders found for the user");
        res.redirect("/admin/dashboard/user");
      }
    } else {
      console.log("User not found");
      res.redirect("/dashboard/user");
    }
  } catch (error) {
    console.error("Error while fetching order details:", error);
    res.render("error/404");
  }
};

// controller for updating the sataus of the order
exports.updateStatus = async (req, res) => {
  const orderId = req.params.id;
  console.log("orderId", orderId);
  try {
    const updatedStatus = await userCollection.findByIdAndUpdate(id, {
      status: req.body.status,
    });
    console.log("updatedStatus", updatedStatus);
    res.redirect("/dashboard/user");
  } catch (error) {
    console.error("There was an error while updating the order status", error);
    res.render("error/404");
  }
};
