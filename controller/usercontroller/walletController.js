// importing the modules for the wallet payment and showing the wallet details
const userCollection = require("../../models/user/userDatabase");
const productCollection = require("../../models/product/productDetails");
const cartCollection = require("../../models/cart/cartDetail");

// controller for getting the wallet
exports.getWallet = async(req, res) => {
  const userId = req.session.user;
  const user = await userCollection.findOne({email:userId});
  if(user){

    res.render("user/wallet",{user});
  }
  
};
