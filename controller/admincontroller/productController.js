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
  // const search = req.qurey.search;
  const page = parseInt(req.query.page);
  const limit = 5;

  const skip = (page - 1) * limit;

  const admin = req.session.admin;
  if (admin) {
    const product = await collection.find().skip(skip).limit(limit);
    res.render("admin/product", { product });
  } else {
    res.redirect("/admin");
  }
};

// for getting the product adding page
exports.getAddProduct = async (req, res) => {
  const admin = req.session.admin;
  if (admin) {
    const category = await categoryCollection.find();
    res.render("admin/add_product", { category });
  } else {
    res.redirect("/admin");
  }
};

// for adding the values in the database
exports.postProductPage = async (req, res) => {
  const admin = req.session.admin;
  console.log(req.body.name, req.body.description, req.body.price);
  const imageArray = [];
  if (admin) {
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
    console.log(productDetails);
    await collection.insertMany([productDetails]);
    res.redirect("/admin/dashboard/product");
  } else {
    res.redirect("/admin");
  }
};

// for getting the product edit page
exports.getEditProduct = async (req, res) => {
  const admin = req.session.admin;
  if (admin) {
    const category = await categoryCollection.find();
    let id = req.params.id;
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
        console.log("Error finding the product....", error);
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
      let id = req.params.id;
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
      console.log("value updated successfully...");
    } catch (error) {
      console.log("The value is not inserted properly...", error);
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
      console.log("The product is deactivated successfully..");
      return res.json({ message: "Product deactivated" });
    } catch (error) {
      console.error("There was an error while deactivating the porduct", error);
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
      console.log("The product is activated successfully...");
      return res.json({ message: "Product is activated" });
    } catch (error) {
      console.error("There was an error while activating the product", error);
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
      console.log(image);
      console.log(ProductId);
      const updatedProduct = await collection.findByIdAndUpdate(
        ProductId,
        { $pull: { image: image } },
        { new: true }
      );
      console.log("Image removed successfully:", updatedProduct);
      res.redirect(`/admin/dashboard/product/edit/${ProductId}`);
    } catch (error) {
      console.error("Error removing image:", error);
      res.status(500).send("Error removing image");
    }
  } else {
    res.redirect("/admin");
  }
};
