// showing the product on the users side

// importing the database
const collection = require("../../models/product/productDetails");
const cartCollection = require("../../models/cart/cartDetail");

// rendering the product page
exports.getProductPage = async (req, res) => {
  const product = await collection.find();
  res.render("user/product", { product });
};

// rendering the product details page
exports.getProductDetail = async (req, res) => {
  console.log("run.");
  const id = req.params.id;
  console.log(id);
  const productDetail = await collection.findById(id);
  const cartDetail = await cartCollection.findOne({ product: id });
  console.log(cartDetail);
  
  res.render("user/single_product", { productDetail, cartDetail });
};


