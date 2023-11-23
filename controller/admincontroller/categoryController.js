// importing the database for the category page
const collection = require("../../models/category/categoryDetail");
const productCollection = require("../../models/product/productDetails");

// getting the category page
exports.getCategoryPage = async (req, res) => {
  const admin = req.session.admin;
  const search = req.query.search;
  const page = parseInt(req.query.page) || 1;
  const ITEMS_PER_PAGE = 5;
  const limit = ITEMS_PER_PAGE;
  const skip = (page - 1) * limit;

  // Define the base query
  const query = {};

  // Add the search criteria to the query
  if (search) {
    query.$or = [{ category: { $regex: ".*" + search + ".*", $options: "i" } }];
  }

  try {
    if (admin) {
      // Fetch categories with pagination
      const categories = await collection.find(query).skip(skip).limit(limit);

      // Calculate total count of categories for pagination
      const totalCount = await collection.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit);

      res.render("admin/category", {
        categories,
        totalPages,
        currentPage: page,
      });
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    res.render("error/500");
  }
};

// for adding the category
exports.getCategoryAdd = (req, res) => {
  const admin = req.session.admin;
  if (admin) {
    res.render("admin/add_category", { error: null });
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
    } catch (error) {
      res.redirect("/admin/dashboard/category/add");
    }
    const categoryDetails = {
      category: req.body.category,
    };
    if (category === null) {
      await collection.insertMany([categoryDetails]);
      res.redirect("/admin/dashboard/category");
    } else {
      res.render("admin/add_category", { error: "category already exists" });
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
      res.redirect("/admin/dashboard/category");
    } catch (error) {
      res.redirect("/admin/dashboard/category/edit");
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
      return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.redirect("/admin");
  }
};
