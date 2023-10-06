// importing the database for the category page
const collection = require("../../models/category/categoryDetail");

// getting the category page
exports.getCategoryPage = async (req, res) => {
  const category = await collection.find();
  res.render("admin/category", { category });
};

// for adding the category
exports.getCategoryAdd = (req, res) => {
  res.render("admin/add_category");
};

// for putting the value in the database and redirecting the category page
exports.postCategory = async (req, res) => {
  console.log(req.body.Type);
  const categoryDetails = {
    Id: req.body.Id,
    Type: req.body.Type,
    Brand: req.body.Brand,
    Gender: req.body.Gender,
  };
  console.log(categoryDetails);
  await collection.insertMany([categoryDetails]);
  res.redirect("/admin/dashboard/category");
};

// for editing the value in the category
exports.getEditCategory = (req, res) => {
  let id = req.params.id;
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
      console.log("Error finding the category....");
      res.redirect("/admin/dashboard/category");
    });
};

// for updating the value in the database
exports.postCategoryUpdate = async (req, res) => {
  try {
    let id = req.params.id;
    const upateCategory = await collection.findByIdAndUpdate(id, {
      Id: req.body.Id,
      Type: req.body.Type,
      Brand: req.body.Brand,
      Gender: req.body.Gender,
    });
    console.log(upateCategory);
    res.redirect("/admin/dashboard/category");
  } catch (error) {
    console.log("There is an error while updating the values....");
    res.redirect("/admin/dashboard/category/edit");
  }
};

// for deleting the category in the database
exports.deleteCategory = async (req, res) => {
  let categoryId = req.params.categoryId;
  try {
    const deleteCat = await collection.findByIdAndRemove(categoryId);
    console.log("Category is deleted successfully");
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("There in deleting the category", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
