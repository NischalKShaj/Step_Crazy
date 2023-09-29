// importing the required modules for the file
const collection = require("../../models/product/productDetails");
const multer = require("multer");

// storing the images in the database
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

// uploading the images in the database
const uploads = multer({
  storage: storage,
}).array("image");

// for getting the product page
exports.getProductPage = (req, res) => {
  res.render("admin/product");
};

// for getting the product adding page
exports.getAddProduct = (req, res) => {
  res.render("admin/add_product");
};

// for posting the values in the database

exports.postProductPage = async (req, res) => {
  console.log(req.body.id, req.body.name, req.body.description, req.body.price);
  const productDetails = {
    id: req.body.id,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock,
    category: req.body.category,
    image : req.file.filename,
  };
  console.log(productDetails);
  await collection.insertMany([productDetails]);
  res.redirect("/admin/dashboard/product");
};

// for posting the dashboard
// exports.postProductPage = async (req, res) => {
//   const product = await collection.find();
//   console.log("hello");
//   res.redirect("/admin/dashboard/product");
// };
