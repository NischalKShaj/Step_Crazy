// importing the required modules for the file
const collection = require("../../models/product/productDetails");
const multer = require("multer");

// storing the images in the database
const storage = multer.memoryStorage();

// uploading the images in the database
const upload = multer({ storage: storage });

exports.getProductPage = (req, res) => {
  res.render("admin/product");
};
