// importing the database for the category page
const collection = require("../../models/category/categoryDetail");
const productCollection = require("../../models/product/productDetails")

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
  let category
  try {
    category = await collection.findOne({category : req.body.category})
    console.log(category);
    
  } catch (error) {
    res.redirect("/admin/dashboard/category/add")
  }
  
  // console.log(category.Type);
  // console.log(req.body.Type);
  const categoryDetails = {
    
    category: req.body.category,
    
  };
  if(category === null){
    console.log(categoryDetails);
    await collection.insertMany([categoryDetails]);
    res.redirect("/admin/dashboard/category");
  } else {
    res.redirect("/admin/dashboard/category/add")
  }
  
  
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
      
      category: req.body.category,
     
    });
    
    console.log(upateCategory);
    res.redirect("/admin/dashboard/category");
  } catch (error) {
    res.redirect("/admin/dashboard/category/edit");
    console.log("There is an error while updating the values....");
  }
};

// // for deleting the category in the database
// exports.deleteCategory = async (req, res) => {
//   let categoryId = req.params.categoryId;
//   try {
//     const deleteCat = await collection.findByIdAndRemove(categoryId);
//     console.log("Category is deleted successfully");
//     const catName = deleteCat.category;
//     console.log(catName);
//     const productData = await productCollection.updateMany({category:catName},{$set:{status:false}})
//     console.log(productData);
//     return res.status(200).json({ message: "Category deleted successfully" });
//   } catch (error) {
//     console.error("There in deleting the category", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// for deleting the category in the database
exports.deleteCategory = async (req, res) => {
  let categoryId = req.params.categoryId;
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
};
