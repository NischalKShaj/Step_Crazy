// this shows the admins login
// modules required for the admin login
const collection = require("../../models/admin/adminDatabase");
const reportCollection = require("../../models/reports/reportDetails");
const productCollection = require("../../models/product/productDetails");
const userCollection = require("../../models/user/userDatabase");

// for rendering the admin page
exports.getAdminPage = async (req, res) => {
  const admin = req.session.admin;
  console.log("admin", admin);
  if (admin) {
    const orders = await reportCollection.find({}, { "orderDetails.date": 1 });

    // for getting the total number of products stock report
    const stockData = await productCollection.find({}, { name: 1, stock: 1 });

    // for getting the total number of orders
    const totalSales = await reportCollection.find().count();

    // for getting the total number of users
    const totalUsers = await userCollection.find().count();

    // Initialize an object to store the counts for each month
    const monthlyCounts = {};

    // Count the reports for each month
    orders.forEach((order) => {
      order.orderDetails.forEach((orderDetail) => {
        const month =
          orderDetail.date instanceof Date
            ? orderDetail.date.toLocaleString("default", { month: "long" })
            : "Invalid Date";

        // Increment the count for the month
        monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
      });
    });

    // Extract months and counts for chart data
    const months = Object.keys(monthlyCounts);
    const counts = Object.values(monthlyCounts);
    const yearlyCounts = {};
    orders.forEach((order) => {
      order.orderDetails.forEach((orderDetail) => {
        const year =
          orderDetail.date instanceof Date
            ? orderDetail.date.getFullYear()
            : null;

        if (year !== null) {
          if (!yearlyCounts[year]) {
            yearlyCounts[year] = 0;
          }

          yearlyCounts[year]++;
        }
      });
    });

    // Extract years and counts from the result
    const years = Object.keys(yearlyCounts).map((year) => parseInt(year));
    const count = Object.values(yearlyCounts);

    const dailyCounts = {}; // Object to store daily counts

    orders.forEach((order) => {
      order.orderDetails.forEach((orderDetail) => {
        const date =
          orderDetail.date instanceof Date
            ? orderDetail.date.toISOString().split("T")[0]
            : "Invalid Date";

        if (dailyCounts[date]) {
          dailyCounts[date]++;
        } else {
          dailyCounts[date] = 1;
        }
      });
    });

    // Convert dailyCounts object to an array for chart data
    const labels = Object.keys(dailyCounts);
    const data = Object.values(dailyCounts);

    // Extract product names and stock values
    const productNames = stockData.map((product) => product.name);
    const stockValues = stockData.map((product) => product.stock);

    // Render the page with the data
    res.render("admin/admindashboard", {
      months,
      counts,
      years,
      count,
      dailyCounts: { labels, data },
      productNames,
      stockValues,
      totalSales,
      totalUsers,
    });
  } else {
    const invalid = req.query.success;
    res.render("admin/admin", { invalid });
  }
};

// for redirecting to the loginpage
exports.Logout = (req, res) => {
  req.session.admin = null;
  res.redirect("/admin");
};
