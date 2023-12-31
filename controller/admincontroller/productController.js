// importing the required modules for the file
const multer = require("multer");
const collection = require("../../models/product/productDetails");
const categoryCollection = require("../../models/category/categoryDetail");

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
  const search = req.query.search;
  const page = parseInt(req.query.page) || 1;
  const ITEMS_PER_PAGE = 8;
  const limit = ITEMS_PER_PAGE;
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

  const admin = req.session.admin;

  try {
    if (admin) {
      // Fetch products with pagination
      const products = await collection.find(query).skip(skip).limit(limit);

      // Calculate total count of products for pagination
      const totalCount = await collection.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit);
      res.render("admin/product", { products, totalPages, currentPage: page });
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    res.render("error/500");
  }
};

// for getting the product adding page
exports.getAddProduct = async (req, res) => {
  const admin = req.session.admin;
  if (admin) {
    const category = await categoryCollection.find();
    res.render("admin/add_product", { category, error: null });
  } else {
    res.redirect("/admin");
  }
};

// for adding the values in the database
exports.postProductPage = async (req, res) => {
  const admin = req.session.admin;

  if (admin) {
    try {
      // Check if a product with the same name already exists
      const existingProduct = await collection.findOne({ name: req.body.name });
      const category = await categoryCollection.find();
      if (existingProduct) {
        // Product with the same name already exists, handle accordingly (e.g., show an error message)
        res.render("admin/add_product", {
          category,
          error: "Product with the same name already exists",
        });
      } else {
        // Product with the same name doesn't exist, proceed with insertion
        const imageArray = [];
        for (const file of req.files) {
          imageArray.push(file.filename);
        }

        const productDetails = {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          stock: req.body.stock,
          category: req.body.category,
          image: imageArray,
        };

        await collection.insertMany([productDetails]);
        res.redirect("/admin/dashboard/product");
      }
    } catch (error) {
      res.render("error/404");
    }
  } else {
    res.redirect("/admin");
  }
};

// for getting the product edit page
exports.getEditProduct = async (req, res) => {
  const admin = req.session.admin;
  if (admin) {
    const category = await categoryCollection.find();
    const id = req.params.id;
    collection
      .findById(id)
      .then((product) => {
        if (!product) {
          res.redirect("/admin/dashboard/product");
        } else {
          res.render("admin/edit_product", { product: product, category });
        }
      })
      .catch((error) => {
        res.redirect("admin/dashboard/product");
      });
  } else {
    res.redirect("/admin");
  }
};

// for posting the updated values
exports.postUpdateProduct = async (req, res) => {
  const admin = req.session.admin;
  if (admin) {
    try {
      const id = req.params.id;
      const updateProduct = await collection.findByIdAndUpdate(
        id,
        {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          stock: req.body.stock,
          category: req.body.category,
        },
        { new: true }
      );

      // to update the images
      if (req.files) {
        const newImages = req.files.map((file) => file.filename);
        updateProduct.image = updateProduct.image.concat(newImages);
      }

      await updateProduct.save();
      res.redirect("/admin/dashboard/product");
    } catch (error) {
      res.redirect("/admin/dashboard/product");
    }
  } else {
    res.redirect("/admin");
  }
};

// for deactivating the product
exports.putDeactivate = async (req, res) => {
  const admin = req.session.admin;
  if (admin) {
    try {
      const productId = req.params.productId;

      const deactivate = await collection.findByIdAndUpdate(
        productId,
        { $set: { status: false } },
        { new: true }
      );
      if (!deactivate) {
        return res.status(404).json({ message: "Product is not found" });
      }
      return res.json({ message: "Product deactivated" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.redirect("/admin");
  }
};

// for activating the product
exports.putActivate = async (req, res) => {
  const admin = req.session.admin;
  if (admin) {
    try {
      const productId = req.params.productId;
      const activate = await collection.findByIdAndUpdate(
        productId,
        { $set: { status: true } },
        { new: true }
      );
      if (!activate) {
        return res.status(404).json({ message: "Product is not found" });
      }
      return res.json({ message: "Product is activated" });
    } catch (error) {
      return res.status(505).json({ message: "Internal server error" });
    }
  } else {
    res.redirect("/admin");
  }
};

// for deleting the image from the product
exports.deleteImage = async (req, res) => {
  const admin = req.session.admin;
  if (admin) {
    try {
      const image = req.params.image;
      const ProductId = req.params.ProductId;
      const updatedProduct = await collection.findByIdAndUpdate(
        ProductId,
        { $pull: { image: image } },
        { new: true }
      );
      res.redirect(`/admin/dashboard/product/edit/${ProductId}`);
    } catch (error) {
      res.status(500).send("Error removing image");
    }
  } else {
    res.redirect("/admin");
  }
};
