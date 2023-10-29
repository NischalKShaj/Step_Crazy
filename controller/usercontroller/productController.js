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

// controller for searching the products
exports.searchProduct = async (req, res) => {
  const productName = req.query.name;

  try {
    if (productName) {
      // If the search query is not empty, use regex for a case-insensitive search
      const regex = new RegExp(productName, "i");
      const products = await collection.find({ name: regex });

      if (products.length > 0) {
        return res.json(products);
      } else {
        return res.status(404).json({ message: "No products found" });
      }
    } else {
      // If the search query is empty, return all products
      const products = await collection.find();
      return res.json(products);
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
