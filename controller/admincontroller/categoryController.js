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
