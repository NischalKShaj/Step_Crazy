// showing the product on the users side

// importing the database
const collection = require("../../models/product/productDetails");


// rendering the product page
exports.getProductPage = async(req, res) => {
    const product = await collection.find()
    res.render('user/product',{product})
  };

// rendering the product details page 
exports.getProductDetail = (req, res) =>{
  res.render('user/single_product')
}