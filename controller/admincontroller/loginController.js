// this shows the admins login
// modules required for the admin login
const collection = require("../../models/admin/adminDatabase");
const reportCollection = require("../../models/reports/reportDetails");

// for rendering the admin page
exports.getAdminPage = async (req, res) => {
  const admin = req.session.admin;
  console.log("admin", admin);
  if (admin) {
    const orders = await reportCollection.find({}, { "orderDetails.date": 1 });

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

    console.log("Monthly Counts:", monthlyCounts);

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

    // Render the page with the data
    res.render("admin/admindashboard", { months, counts, years, count });
  } else {
    const invalid = req.query.success;
    console.log(invalid);
    res.render("admin/admin", { invalid });
  }
};

// for redirecting to the loginpage
exports.Logout = (req, res) => {
  req.session.admin = null;
  res.redirect("/admin");
};
