// ===================> controllers for reports <=========================

// importing the required modules
const reportCollection = require("../../models/reports/reportDetails");
const productCollection = require("../../models/product/productDetails");
const userCollection = require("../../models/user/userDatabase");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");

// conroller for downloading the yearly sales report as pdf
exports.downloadYearlySalesPdf = async (req, res) => {
  try {
    const selectedYear = req.query.year; // Assuming you are sending the selected year in the request body
    console.log("selectedYear", selectedYear);

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
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
};

// controller for downloading the yearly sales report as excel sheet
exports.downloadYearlySalesExcel = async (req, res) => {
  try {
    const selectedYear = req.query.year;
    console.log("selectedYear", selectedYear);

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
    console.error("Error generating Excel:", error);
    res.status(500).send("Internal Server Error");
  }
};

// controller for downloading the monthly sales report as pdf
exports.downloadMonthlySalesPdf = async (req, res) => {
  try {
    const selectedMonthName = req.query.month; // Assuming you are sending the selected month in the request body as a string (e.g., 'January')

    const selectedMonth =
      new Date(Date.parse(`${selectedMonthName} 1, 2023`)).getMonth() + 1;
    console.log("selectedMonth", selectedMonth);

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
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
};

// controller for downloading the monthly sales report as excel sheet
exports.downloadMonthlySalesExcel = async (req, res) => {
  try {
    const selectedMonthName = req.query.month; // Assuming you are sending the selected month in the request body as a string (e.g., 'January')

    const selectedMonth =
      new Date(Date.parse(`${selectedMonthName} 1, 2023`)).getMonth() + 1;
    console.log("selectedMonth", selectedMonth);

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
    console.error("Error generating Excel:", error);
    res.status(500).send("Internal Server Error");
  }
};
