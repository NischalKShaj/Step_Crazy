// <========================> admin dashboard <=========================>

// importing the modules for the data in the admins database
const collection = require("../../models/admin/adminDatabase");
const reportCollection = require("../../models/reports/reportDetails");

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
    }
  } catch (error) {
    console.log("error", error);
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

    console.log(admin);
    if (
      admin.email === req.body.email &&
      admin.password === req.body.password
    ) {
      req.session.admin = req.body.email;
      console.log("inside the dashboard...");
      const orders = await reportCollection.find(
        {},
        { "orderDetails.date": 1 }
      );

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
  console.log(req.body.password);
  if (Admin) {
    const admin = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    console.log(admin);
    await collection.insertMany([admin]);
    res.redirect("/admin/dashboard/admins");
  } else {
    res.redirect("/admin");
  }
};
