// showing the product on the users side

// importing the database
const collection = require("../../models/product/productDetails");
const cartCollection = require("../../models/cart/cartDetail");

// controller for searching and to show the products
exports.getProductPage = async (req, res) => {
  try {
    const search = req.query.search;

    // if the search is enabled then it will show this
    if (search) {
      const product = await collection.find({
        $or: [
          { name: { $regex: ".*" + search + ".*", $options: "i" } },
          { category: { $regex: ".*" + search + ".*", $options: "i" } },
        ],
      });

      console.log("product", product);
      res.render("user/product", { product });
    } else {
      // if the search is not activated then it will show this page
      const product = await collection.find();

      res.render("user/product", { product });
    }
  } catch (error) {
    console.error("There is an error while loading the page");
    res.render("error/404");
  }
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
