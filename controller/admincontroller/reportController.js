// ===================> controllers for reports <=========================

// importing the required modules
const reportCollection = require("../../models/reports/reportDetails");

// controller for showing the entire count of sales
exports.showSalesReport = async (req, res) => {
  try {
    const report = await reportCollection.find().count();
    console.log("report", report);
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("there is an error", error);
    res.render("error/404");
  }
};
