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

    // retriving the users cart
    const cart = await cartCollection
      .findOne({ user: user._id })
      .populate("product");

    if (!cart) {
      console.log("inside the cart error");
      return res.render("error/404");
    }

    // creating the order document
    const order = {
      cart: cart,
    };
    console.log("order",order);
    // adding the order to the user collection
    user.order.push(order);

    // saving the contents of in the user collection 
    await user.save();
    
    res.render("user/order-detail");
  } catch (error) {
    console.log("error in the catch block");
    res.render("error/404")
  }
};
