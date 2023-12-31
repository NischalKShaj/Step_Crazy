// <========================> admin dashboard <=========================>

// importing the modules for the data in the admins database
const collection = require("../../models/admin/adminDatabase");
const reportCollection = require("../../models/reports/reportDetails");
const productCollection = require("../../models/product/productDetails");
const userCollection = require("../../models/user/userDatabase");

let admin;

// for getting the admin dashboard
exports.getAdminHome = async (req, res) => {
  const adminId = req.session.admin;
  const admin = await collection.findOne({ email: adminId });
  try {
    if (admin) {
      const orders = await reportCollection.find(
        {},
        { "orderDetails.date": 1 }
      );
      // for getting the stock of the product
      const stockData = await productCollection.find({}, { name: 1, stock: 1 });

      // for getting the total number of orders
      const totalSales = await reportCollection.find().count();

      // for getting the users signup
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

      // Count daily orders
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
    }
  } catch (error) {
    res.render("error/404");
  }
};

// for showing the admin dashboard
exports.postAdminHome = async (req, res) => {
  try {
    admin = await collection.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (
      admin.email === req.body.email &&
      admin.password === req.body.password
    ) {
      req.session.admin = req.body.email;
      const orders = await reportCollection.find(
        {},
        { "orderDetails.date": 1 }
      );
      // for getting total number of products stock
      const stockData = await productCollection.find({}, { name: 1, stock: 1 });

      const totalUsers = await userCollection.find().count();

      // for getting the total number of orders
      const totalSales = await reportCollection.find().count();

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
      const message = "Invalid admin credentials";
      res.redirect(`/admin?success=${encodeURIComponent(message)}`);
    }
  } catch (err) {
    const message = "Invalid admin credentials";
    res.redirect(`/admin?success=${encodeURIComponent(message)}`);
  }
};

// for showing the values in the admin page
exports.getAdmin = async (req, res) => {
  const Admin = req.session.admin;
  if (Admin) {
    admin = await collection.find();
    res.render("admin/adminmanagement", { admin });
  } else {
    res.redirect("/admin");
  }
};

// for gettin the form for adding the new admn
exports.getAdminAdd = (req, res) => {
  const Admin = req.session.admin;
  if (Admin) {
    res.render("admin/add_admin");
  } else {
    res.redirect("/admin");
  }
};

// for inserting the value in the admin database
exports.postAdmin = async (req, res) => {
  const Admin = req.session.admin;
  if (Admin) {
    const admin = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    await collection.insertMany([admin]);
    res.redirect("/admin/dashboard/admins");
  } else {
    res.redirect("/admin");
  }
};
