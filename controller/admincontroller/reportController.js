// ===================> controllers for reports <=========================

// importing the required modules
const reportCollection = require("../../models/reports/reportDetails");
const productCollection = require("../../models/product/productDetails");
const userCollection = require("../../models/user/userDatabase");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const fs = require("fs");

// conroller for downloading the yearly sales report as pdf
exports.downloadYearlySalesPdf = async (req, res) => {
  try {
    const selectedYear = req.query.year;

    const yearlySales = await reportCollection
      .find({
        "orderDetails.date": {
          $gte: new Date(selectedYear, 0, 1), // Start of the selected year
          $lt: new Date(selectedYear, 11, 31, 23, 59, 59),
        },
      })
      .populate("orderDetails.cart orderDetails.products");

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set the response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=yearly_sales_${selectedYear}.pdf`
    );

    // Pipe the PDF document to the response
    doc.pipe(res);

    const imagePath = "public/Img/login/logo.png"; // Change this to the path of your image
    const imageWidth = 100; // Adjust image width based on your layout
    const imageX = 550 - imageWidth; // Adjust X-coordinate based on your layout
    const imageY = 50; // Adjust Y-coordinate to place the image at the top
    doc.image(imagePath, imageX, imageY, { width: imageWidth });

    // Add content to the PDF
    doc
      .fontSize(16)
      .text(`Yearly Sales Report - ${selectedYear}`, { align: "center" });

    // Loop through yearly sales and add details to the PDF
    yearlySales.forEach((order) => {
      order.orderDetails.forEach((orderDetail) => {
        doc.moveDown().fontSize(14).text(`Order ID: ${order._id}`);
        doc.text(
          `Product Name: ${orderDetail.products
            .map((product) => product.name)
            .join(", ")}`
        );
        doc.text(`Price: ${orderDetail.price}`);
        doc.text(`Selected Address: ${orderDetail.selectedAddress.join(", ")}`);
        doc.text(`Payment Method: ${orderDetail.paymentMethod}`);
      });
    });

    // Finalize the PDF and end the response
    doc.end();
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// controller for downloading the yearly sales report as excel sheet
exports.downloadYearlySalesExcel = async (req, res) => {
  try {
    const selectedYear = req.query.year;

    const yearlySales = await reportCollection
      .find({
        "orderDetails.date": {
          $gte: new Date(selectedYear, 0, 1),
          $lt: new Date(selectedYear, 11, 31, 23, 59, 59),
        },
      })
      .populate("orderDetails.cart orderDetails.products");

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Yearly Sales");

    // Add column headers to the worksheet
    worksheet.columns = [
      { header: "Order ID", key: "orderId", width: 15 },
      { header: "Product Name", key: "productName", width: 30 },
      { header: "Price", key: "price", width: 15 },
      { header: "Selected Address", key: "selectedAddress", width: 40 },
      { header: "Payment Method", key: "paymentMethod", width: 20 },
    ];

    // Add data to the worksheet
    yearlySales.forEach((order) => {
      order.orderDetails.forEach((orderDetail) => {
        worksheet.addRow({
          orderId: order._id.toString(),
          productName: orderDetail.products
            .map((product) => product.name)
            .join(", "),
          price: orderDetail.price.toString(),
          selectedAddress: orderDetail.selectedAddress.join(", "),
          paymentMethod: orderDetail.paymentMethod,
        });
      });
    });

    // Set the response headers for Excel download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=yearly_sales_${selectedYear}.xlsx`
    );

    // Pipe the Excel workbook to the response
    await workbook.xlsx.write(res);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// controller for downloading the monthly sales report as pdf
exports.downloadMonthlySalesPdf = async (req, res) => {
  try {
    const selectedMonthName = req.query.month;

    const selectedMonth =
      new Date(Date.parse(`${selectedMonthName} 1, 2023`)).getMonth() + 1;

    const startOfMonth = new Date(2023, selectedMonth - 1, 1);
    const endOfMonth = new Date(2023, selectedMonth, 1);

    const monthlySales = await reportCollection
      .find({
        "orderDetails.date": {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      })
      .populate("orderDetails.cart orderDetails.products");

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set the response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=monthly_sales_${selectedMonthName}.pdf`
    );

    // Pipe the PDF document to the response
    doc.pipe(res);

    const imagePath = "public/Img/login/logo.png"; // Change this to the path of your image
    const imageWidth = 100; // Adjust image width based on your layout
    const imageX = 550 - imageWidth; // Adjust X-coordinate based on your layout
    const imageY = 50; // Adjust Y-coordinate to place the image at the top
    doc.image(imagePath, imageX, imageY, { width: imageWidth });

    // Add content to the PDF
    doc
      .fontSize(16)
      .text(`Monthly Sales Report - ${selectedMonthName}`, { align: "center" });

    // Loop through monthly sales and add details to the PDF
    monthlySales.forEach((order) => {
      order.orderDetails.forEach((orderDetail) => {
        doc.moveDown().fontSize(14).text(`Order ID: ${order._id}`);
        doc.text(
          `Product Name: ${orderDetail.products
            .map((product) => product.name)
            .join(", ")}`
        );
        doc.text(`Price: ${orderDetail.price}`);
        doc.text(`Selected Address: ${orderDetail.selectedAddress.join(", ")}`);
        doc.text(`Payment Method: ${orderDetail.paymentMethod}`);
      });
    });

    // Finalize the PDF and end the response
    doc.end();
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// controller for downloading the monthly sales report as excel sheet
exports.downloadMonthlySalesExcel = async (req, res) => {
  try {
    const selectedMonthName = req.query.month;

    const selectedMonth =
      new Date(Date.parse(`${selectedMonthName} 1, 2023`)).getMonth() + 1;

    const startOfMonth = new Date(2023, selectedMonth - 1, 1);
    const endOfMonth = new Date(2023, selectedMonth, 1);

    const monthlySales = await reportCollection
      .find({
        "orderDetails.date": {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      })
      .populate("orderDetails.cart orderDetails.products");

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Monthly Sales");

    // Set columns in the Excel sheet
    worksheet.columns = [
      { header: "Order ID", key: "orderId", width: 20 },
      { header: "Product Name", key: "productName", width: 30 },
      { header: "Price", key: "price", width: 15 },
      { header: "Selected Address", key: "selectedAddress", width: 40 },
      { header: "Payment Method", key: "paymentMethod", width: 20 },
    ];

    // Add data to the Excel sheet
    monthlySales.forEach((order) => {
      order.orderDetails.forEach((orderDetail) => {
        worksheet.addRow({
          orderId: order._id.toString(),
          productName: orderDetail.products
            .map((product) => product.name)
            .join(", "),
          price: orderDetail.price.toString(),
          selectedAddress: orderDetail.selectedAddress.join(", "),
          paymentMethod: orderDetail.paymentMethod,
        });
      });
    });

    // Set the response headers for Excel download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=monthly_sales_${selectedMonthName}.xlsx`
    );

    // Pipe the Excel workbook to the response
    await workbook.xlsx.write(res);

    // End the response
    res.end();
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// controller for downloading the daily sales report as pdf
exports.downloadDailySalesPdf = async (req, res) => {
  try {
    const selectedDate = new Date(req.query.date);
    
    const yearlySales = await reportCollection
      .find({
        "orderDetails.date": {
          $gte: selectedDate, // Start of the selected date
          $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000), // Start of the next day
        },
      })
      .populate("orderDetails.cart orderDetails.products");

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set the response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=daily_sales_${
        selectedDate.toISOString().split("T")[0]
      }.pdf`
    );

    // Pipe the PDF document to the response
    doc.pipe(res);

    const imagePath = "public/Img/login/logo.png"; // Change this to the path of your image
    const imageWidth = 100; // Adjust image width based on your layout
    const imageX = 550 - imageWidth; // Adjust X-coordinate based on your layout
    const imageY = 50; // Adjust Y-coordinate to place the image at the top
    doc.image(imagePath, imageX, imageY, { width: imageWidth });

    // Add content to the PDF
    doc
      .fontSize(16)
      .text(
        `Daily Sales Report - ${selectedDate.toISOString().split("T")[0]}`,
        { align: "center" }
      );

    // Loop through daily sales and add details to the PDF
    yearlySales.forEach((order) => {
      order.orderDetails.forEach((orderDetail) => {
        const orderDate = new Date(orderDetail.date);
        if (
          orderDate.toISOString().split("T")[0] ===
          selectedDate.toISOString().split("T")[0]
        ) {
          doc.moveDown().fontSize(14).text(`Order ID: ${order._id}`);
          doc.text(
            `Product Name: ${orderDetail.products
              .map((product) => product.name)
              .join(", ")}`
          );
          doc.text(`Price: ${orderDetail.price}`);
          doc.text(
            `Selected Address: ${orderDetail.selectedAddress.join(", ")}`
          );
          doc.text(`Payment Method: ${orderDetail.paymentMethod}`);
        }
      });
    });

    // Finalize the PDF and end the response
    doc.end();
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// controller for downloading the daily sales report as excel sheet
exports.downloadDailySalesExcel = async (req, res) => {
  try {
    const selectedDate = new Date(req.query.date);

    const yearlySales = await reportCollection
      .find({
        "orderDetails.date": {
          $gte: selectedDate, // Start of the selected date
          $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000), // Start of the next day
        },
      })
      .populate("orderDetails.cart orderDetails.products");

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Daily Sales Report");

    // Define the columns in the worksheet
    worksheet.columns = [
      { header: "Order ID", key: "orderId", width: 15 },
      { header: "Product Name", key: "productName", width: 30 },
      { header: "Price", key: "price", width: 15 },
      { header: "Selected Address", key: "selectedAddress", width: 30 },
      { header: "Payment Method", key: "paymentMethod", width: 20 },
    ];

    // Add data to the worksheet
    yearlySales.forEach((order) => {
      order.orderDetails.forEach((orderDetail) => {
        const orderDate = new Date(orderDetail.date);
        if (
          orderDate.toISOString().split("T")[0] ===
          selectedDate.toISOString().split("T")[0]
        ) {
          worksheet.addRow({
            orderId: order._id,
            productName: orderDetail.products
              .map((product) => product.name)
              .join(", "),
            price: orderDetail.price,
            selectedAddress: orderDetail.selectedAddress.join(", "),
            paymentMethod: orderDetail.paymentMethod,
          });
        }
      });
    });

    // Set the response headers for Excel download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=daily_sales_${
        selectedDate.toISOString().split("T")[0]
      }.xlsx`
    );

    // Pipe the Excel workbook to the response
    await workbook.xlsx.write(res);

    // End the response
    res.end();
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// controller for getting the overall stocks of the product as pdf
exports.downloadProductStockPdf = async (req, res) => {
  try {
    const stockDetails = await productCollection.find(
      {},
      { name: 1, stock: 1 }
    );
    // Create a new PDF document
    const doc = new PDFDocument();

    // Set the response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=product_stock_report.pdf"
    );

    // Pipe the PDF document to the response
    doc.pipe(res);

    const imagePath = "public/Img/login/logo.png"; // Change this to the path of your image
    const imageWidth = 100; // Adjust image width based on your layout
    const imageX = 550 - imageWidth; // Adjust X-coordinate based on your layout
    const imageY = 50; // Adjust Y-coordinate to place the image at the top
    doc.image(imagePath, imageX, imageY, { width: imageWidth });

    // Add content to the PDF
    doc.fontSize(16).text("Product Stock Report", { align: "center" });
    doc.moveDown();

    // Loop through stock details and add them to the PDF
    stockDetails.forEach((product, index) => {
      doc.text(
        `${index + 1}. Product: ${product.name}, Stock: ${product.stock}`
      );
      doc.moveDown();
    });

    // Finalize the PDF and end the response
    doc.end();
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// controller for downloading the stocks of the product as excel sheet
exports.downloadProductStockExcel = async (req, res) => {
  try {
    const stockDetails = await productCollection.find(
      {},
      { name: 1, stock: 1 }
    );

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Product Stock Report");

    // Add headers to the worksheet
    worksheet.addRow(["Product", "Stock"]);

    // Add data to the worksheet
    stockDetails.forEach((product) => {
      worksheet.addRow([product.name, product.stock]);
    });

    // Set the response headers for Excel download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=product_stock_report.xlsx"
    );

    // Write the workbook to the response
    await workbook.xlsx.write(res);

    // End the response
    res.end();
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// controller for downloading the total sales report as pdf
exports.downloadSalesReportPdf = async (req, res) => {
  try {
    // Fetch the sales report data from the database
    const reportData = await reportCollection.find();

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=sales_report.pdf"
    );

    // Pipe the PDF document directly to the response
    doc.pipe(res);

    const imagePath = "public/Img/login/logo.png"; // Change this to the path of your image
    const imageWidth = 100; // Adjust image width based on your layout
    const imageX = 550 - imageWidth; // Adjust X-coordinate based on your layout
    const imageY = 50; // Adjust Y-coordinate to place the image at the top
    doc.image(imagePath, imageX, imageY, { width: imageWidth });

    // Add heading to the PDF
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .text("Sales Report", { align: "center" });

    // Loop through report data and add them to the PDF
    for (const entry of reportData) {
      const orderDetails = entry.orderDetails[0]; // Assuming there is only one orderDetails entry

      // Fetch product name from product ID (replace 'productId' with the actual field in your data)
      const productName = await getProductFromId(orderDetails.products[0]);

      // Move down before each entry
      doc.moveDown();

      doc.font("Helvetica-Bold").text("ID: ", { continued: true });
      doc.font("Helvetica").text(orderDetails._id);

      doc.font("Helvetica-Bold").text("Product Name: ", { continued: true });
      doc.font("Helvetica").text(productName);

      doc.font("Helvetica-Bold").text("Quantity: ", { continued: true });
      doc.font("Helvetica").text(orderDetails.quantity[0]);

      doc.font("Helvetica-Bold").text("Price: ", { continued: true });
      doc.font("Helvetica").text(orderDetails.price[0].toString());

      doc.font("Helvetica-Bold").text("Status: ", { continued: true });
      doc.font("Helvetica").text(orderDetails.status);

      doc.font("Helvetica-Bold").text("Address:", { continued: true });
      doc.font("Helvetica").text(orderDetails.selectedAddress.join(", "));

      doc.font("Helvetica-Bold").text("Payment Method: ", { continued: true });
      doc.font("Helvetica").text(orderDetails.paymentMethod);

      doc.font("Helvetica-Bold").text("Date: ", { continued: true });
      doc.font("Helvetica").text(orderDetails.date);
    }
    // Finalize the PDF and end the response
    doc.end();
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// Function to fetch product name from product ID for both pdf and the excel sheet
async function getProductFromId(productId) {
  try {
    const product = await productCollection.findOne({ _id: productId });
    console.log(product);
    return product ? product.name : "Unknown Product";
  } catch (error) {
    return "Unknown Product";
  }
}

//downloading the sales report as excel sheet
exports.downloadSalesReportExcel = async (req, res) => {
  try {
    // Fetch the sales report data from the database
    const reportData = await reportCollection.find();

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sales Report");

    // Add column headers to the worksheet
    worksheet.columns = [
      { header: "ID", key: "id", width: 15 },
      { header: "Product Name", key: "productName", width: 30 },
      { header: "Quantity", key: "quantity", width: 15 },
      { header: "Price", key: "price", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Address", key: "address", width: 80 },
      { header: "Payment Method", key: "paymentMethod", width: 20 },
      { header: "Date", key: "date", width: 40 },
    ];

    // Loop through report data and add them to the worksheet
    for (const entry of reportData) {
      const orderDetails = entry.orderDetails[0]; // Assuming there is only one orderDetails entry

      // Fetch product name from product ID (replace 'productId' with the actual field in your data)
      const productName = await getProductFromId(orderDetails.products[0]);

      // Add each entry to the worksheet
      worksheet.addRow({
        id: orderDetails._id,
        productName,
        quantity: orderDetails.quantity[0],
        price: orderDetails.price[0].toString(),
        status: orderDetails.status,
        address: orderDetails.selectedAddress.join(", "),
        paymentMethod: orderDetails.paymentMethod,
        date: orderDetails.date,
      });
    }

    // Set response headers for Excel download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=sales_report.xlsx"
    );

    // Pipe the Excel workbook to the response
    await workbook.xlsx.write(res);

    // End the response
    res.end();
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// controller for downloading the total users details as pdf
exports.downloadTotalUsers = async (req, res) => {
  try {
    // Fetch the total users' details from the database
    const users = await userCollection.find();

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=total_users_report.pdf"
    );

    // Pipe the PDF document directly to the response
    doc.pipe(res);

    const imagePath = "public/Img/login/logo.png"; // Change this to the path of your image
    const imageWidth = 100; // Adjust image width based on your layout
    const imageX = 550 - imageWidth; // Adjust X-coordinate based on your layout
    const imageY = 50; // Adjust Y-coordinate to place the image at the top
    doc.image(imagePath, imageX, imageY, { width: imageWidth });

    // Add heading to the PDF
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .text("Total Users Report", { align: "center" });

    // Loop through user data and add them to the PDF
    for (const user of users) {
      // Move down before each user entry
      doc.moveDown();

      doc
        .font("Helvetica-Bold")
        .text(`Name: ${user.first_name} ${user.last_name}`);
      doc.font("Helvetica").text(`Email: ${user.email}`);
      doc.font("Helvetica").text(`Phone: ${user.phone}`);
      doc.font("Helvetica").text(`Gender: ${user.gender}`);
      doc.font("Helvetica-Bold").text("Address:");

      // Check if the address array is empty
      if (user.address.length === 0) {
        doc.font("Helvetica").text("Empty");
      } else {
        // Loop through addresses and add them to the PDF
        for (const address of user.address) {
          doc.font("Helvetica").text(`- Pincode: ${address.pincode}`);
          doc.font("Helvetica").text(`  Locality: ${address.locality}`);
          doc.font("Helvetica").text(`  Full Address: ${address.fullAddress}`);
          doc.font("Helvetica").text(`  City: ${address.city}`);
          doc.font("Helvetica").text(`  State: ${address.state}`);
        }
      }

      doc.font("Helvetica-Bold").text(`Wallet: ${user.wallet}`);

      // Check if the usedCoupons array is empty
      if (user.usedCoupons.length === 0) {
        doc.font("Helvetica-Bold").text("Used Coupons: Empty");
      } else {
        // Extract coupon names and join them with commas
        const couponNames = user.usedCoupons
          .map((coupon) => coupon.coupon)
          .join(", ");
        doc.font("Helvetica-Bold").text(`Used Coupons: ${couponNames}`);
      }
    }

    // Finalize the PDF and end the response
    doc.end();
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// Controller for downloading the total users' details as Excel
exports.downloadTotalUsersExcel = async (req, res) => {
  try {
    // Fetch the total users' details from the database
    const users = await userCollection.find();

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Total Users Report");

    // Add column headers to the worksheet
    worksheet.columns = [
      { header: "Name", key: "name", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Gender", key: "gender", width: 15 },
      { header: "Address", key: "address", width: 40 },
      { header: "Wallet", key: "wallet", width: 15 },
      { header: "Used Coupons", key: "usedCoupons", width: 30 },
    ];

    // Loop through user data and add them to the worksheet
    for (const user of users) {
      // Extract coupon names and join them with commas
      const couponNames = user.usedCoupons
        .map((coupon) => coupon.coupon)
        .join(", ");

      // Add each user entry to the worksheet
      worksheet.addRow({
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        address:
          user.address.length > 0
            ? user.address
                .map(
                  (a) =>
                    `${a.pincode}, ${a.locality}, ${a.fullAddress}, ${a.city}, ${a.state}`
                )
                .join("\n")
            : "Empty",
        wallet: user.wallet,
        usedCoupons: user.usedCoupons.length > 0 ? couponNames : "Empty",
      });
    }

    // Set response headers for Excel download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=total_users_report.xlsx"
    );

    // Pipe the Excel workbook to the response
    await workbook.xlsx.write(res);

    // End the response
    res.end();
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
