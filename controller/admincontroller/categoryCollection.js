// importing the database for the category page
const collection = require("../../models/category/categoryDetail");

// getting the category page
const getCategoryPage = (req, res) => {
  res.render("admin/category");
};

// for adding the category
const getCategoryAdd = (req, res) => {
  res.render("admin/category_add");
};
