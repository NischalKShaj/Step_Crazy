// showing the product on the users side

// importing the database
const collection = require("../../models/product/productDetails");
const cartCollection = require("../../models/cart/cartDetail");

// controller for searching and to show the products
exports.getProductPage = async (req, res) => {
  try {
    const search = req.query.search;
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const priceRange = req.query.priceRange;
    const limit = 9;

    // Calculate the skip value to paginate
    const skip = (page - 1) * limit;

    // Define a base query
    const query = {};

    // Add the search criteria to the query
    if (search) {
      query.$or = [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { category: { $regex: ".*" + search + ".*", $options: "i" } },
      ];
    }

    // Add the price range filter to the query
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-");
      if (minPrice) {
        query.price = { $gte: parseInt(minPrice) };
      }
      if (maxPrice) {
        if (query.price) {
          query.price.$lte = parseInt(maxPrice);
        } else {
          query.price = { $lte: parseInt(maxPrice) };
        }
      }
    }

    // Perform the database query with pagination
    const product = await collection
      .find(query)
      .skip(skip)
      .limit(limit);

    console.log("product", product);
    res.render("user/product", { product });
  } catch (error) {
    console.error("There is an error while loading the page", error);
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
  console.log("product", productDetail);
  res.render("user/single_product", { productDetail, cartDetail });
};
