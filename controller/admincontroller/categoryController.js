// importing the database for the category page
const collection = require("../../models/category/categoryDetail");
const productCollection = require("../../models/product/productDetails");

// getting the category page
exports.getCategoryPage = async (req, res) => {
  const admin = req.session.admin;
  const search = req.query.search;
  const page = parseInt(req.query.page);
  const limit = 5;

  const skip = (page - 1) * limit;

  // define the base query
  const query = {};

  // add the search criteria
  if (search) {
    query.$or = [{ category: { $regex: ".*" + search + ".*", $options: "i" } }];
  }

  if (admin) {
    const category = await collection.find(query).skip(skip).limit(limit);
    res.render("admin/category", { category });
  } else {
    res.redirect("/admin");
  }
};

// for adding the category
exports.getCategoryAdd = (req, res) => {
  const admin = req.session.admin;
  if (admin) {
    res.render("admin/add_category");
  } else {
    res.redirect("/admin");
  }
};

// for putting the value in the database and redirecting the category page
exports.postCategory = async (req, res) => {
  let category;
  const admin = req.session.admin;
  if (admin) {
    try {
      category = await collection.findOne({ category: req.body.category });
      console.log(category);
    } catch (error) {
      console.error("error in the page", error);
      res.redirect("/admin/dashboard/category/add");
    }
    const categoryDetails = {
      category: req.body.category,
    };
    if (category === null) {
      console.log(categoryDetails);
      await collection.insertMany([categoryDetails]);
      res.redirect("/admin/dashboard/category");
    } else {
      res.redirect("/admin/dashboard/category/add");
    }
  } else {
    res.redirect("/admin");
  }
};

// for editing the value in the category
exports.getEditCategory = (req, res) => {
  const admin = req.session.admin;
  if (admin) {
    const id = req.params.id;
    collection
      .findById(id)
      .then((category) => {
        if (!category) {
          res.redirect("/admin/dashboard/category");
        } else {
          res.render("admin/edit_category", { category: category });
        }
      })
      .catch((error) => {
        console.log("Error finding the category....", error);
        res.redirect("/admin/dashboard/category");
      });
  } else {
    res.redirect("/admin");
  }
};

// for updating the value in the database
exports.postCategoryUpdate = async (req, res) => {
  const admin = req.session.admin;
  if (admin) {
    try {
      const id = req.params.id;

      const upateCategory = await collection.findByIdAndUpdate(id, {
        category: req.body.category,
      });

      console.log("upateCategory", upateCategory);
      res.redirect("/admin/dashboard/category");
    } catch (error) {
      res.redirect("/admin/dashboard/category/edit");
      console.log("There is an error while updating the values....", error);
    }
  } else {
    res.redirect("/admin");
  }
};

// for deleting the category in the database
exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  const admin = req.session.admin;
  if (admin) {
    try {
      // Find and remove the category by ID
      const deletedCategory = await collection.findByIdAndRemove(categoryId);

      if (!deletedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      const catName = deletedCategory.category;

      // Update the status of products with the same category name to "false"
      const productData = await productCollection.updateMany(
        { category: catName },
        { $set: { status: false } }
      );

      console.log("Category is deleted successfully");
      console.log(catName);
      console.log(productData);

      return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error in deleting the category", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.redirect("/admin");
  }
};
