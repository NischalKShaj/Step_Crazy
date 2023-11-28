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
        // Filtering the cancelled order from the order history
        const canecelledOrders = orders.filter(
          (order) =>
            order.status === "Cancel" &&
            (order.paymentMethod === "onlinepayment" ||
              order.paymentMethod === "wallet")
        );
        for (const orders of canecelledOrders) {
          const productId = orders.products;

          const orderStatus = await productCollection
            .find({ _id: { $in: productId } })
            .exec();
          allOrderDetails.push(orderStatus);
        }
        const cancelledOrderDetails = await Promise.all(
          canecelledOrders.map(async (order) => {
            const productDetails = await Promise.all(
              order.products.map(async (productId) => {
                const product = await productCollection
                  .findById(productId)
                  .exec();
                const productName = product ? product.name : "Unknown Product";
                return {
                  image:
                    product.image && product.image.length > 0
                      ? product.image[0]
                      : "/path/to/placeholder-image.jpg",
                  name: productName,
                };
              })
            );
            return {
              products: productDetails,
              quantity: order.quantity,
              price: order.price,
            };
          })
        );
        // Filtering the returned order from the order history
        const returnOrders = orders.filter(
          (order) =>
            order.status === "Returned" &&
            (order.paymentMethod === "cod" ||
              order.paymentMethod === "onlinepayment" ||
              order.paymentMethod === "wallet")
        );
        for (const ordered of returnOrders) {
          const product = ordered.products;
          const orderReturned = await productCollection
            .find({ _id: { $in: product } })
            .exec();
          allOrderDetails.push(orderReturned);
        }

        const returnedOrderDetails = await Promise.all(
          returnOrders.map(async (order) => {
            const productDetails = await Promise.all(
              order.products.map(async (productId) => {
                const product = await productCollection
                  .findById(productId)
                  .exec();
                const productName = product ? product.name : "Unknown Product";
                return {
                  image:
                    product.image && product.image.length > 0
                      ? product.image[0]
                      : "/path/to/placeholder-image.jpg",
                  name: productName,
                };
              })
            );

            return {
              products: productDetails,
              quantity: order.quantity,
              price: order.price,
            };
          })
        );
        res.render("user/wallet", {
          user,
          orders: walletOrders,
          canecelledOrders: cancelledOrderDetails,
          returnOrders: returnedOrderDetails,
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
