// importing the required modules for the file
const multer = require("multer");
const collection = require("../../models/product/productDetails");

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
exports.uploads = multer({
  storage: storage,
}).array("image");

// for getting the product page
exports.getProductPage = async (req, res) => {
  const product = await collection.find();
  res.render("admin/product", { product });
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
    image: req.files[0].filename,
  };
  console.log(productDetails);
  await collection.insertMany([productDetails]);
  res.redirect("/admin/dashboard/product");
};

// for getting the product edit page
exports.getEditProduct = (req, res) => {
  let id = req.params.id;
  collection
    .findById(id)
    .then((product) => {
      if (!product) {
        res.redirect("/admin/dashboard/product");
      } else {
        res.render("admin/edit_product");
      }
    })
    .catch((error) => {
      console.log("Error finding the product....");
      res.redirect("admin/dashboard/product");
    });
};
