// importing the modules for the wallet payment and showing the wallet details
const userCollection = require("../../models/user/userDatabase");
const productCollection = require("../../models/product/productDetails");
const cartCollection = require("../../models/cart/cartDetail");

// controller for getting the wallet page
exports.getWallet = async (req, res) => {
  const userId = req.session.user;
  try {
    const user = await userCollection.findOne({ email: userId });
    console.log("user", user);
    // if the user is valid then only the user will be directed to the wallet
    if (user) {
      const order = user.order;
      console.log("orders", order);
      const orderDetail = [];

      for (const orders of order) {
        const product = orders.products;
        paymentMethod = orders.paymentMethod;
        console.log("paymentMethod", paymentMethod);

        // condition for checking whether the payment method is wallet
        if (paymentMethod == "wallet") {
          console.log("inside wallet payment method");
          const orderDetails = await productCollection
            .find({ _id: { $in: product } })
            .exec();
          orderDetail.push(orderDetails);
          console.log("orderdetails", orderDetails);
        }
      }
      console.log("orderDetail", orderDetail);

      // rendering the wallet page
      res.render("user/wallet", { user, order, orderDetail });
    } else {
      // if the user is invalid or not loged in then the user is redirected to the loginpage
      res.redirect("/login");
    }
  } catch (error) {
    // handling the error if there is any error regarding rendering the wallet page
    console.error("Error while rendering the wallet page", error);
    res.render("error/404");
  }
};
