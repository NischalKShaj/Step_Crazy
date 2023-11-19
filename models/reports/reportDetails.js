// ======================> collection for showing the reports <==============================

// importing the required modules
const mongoose = require("mongoose");

// schema for the collection
const stepCrazy = new mongoose.Schema({
  orderDetails: [
    {
      cart: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "cart",
          required: true,
        },
      ],
      products: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
      ],
      quantity: [
        {
          type: String,
          required: true,
        },
      ],
      price: [
        {
          type: Number,
          required: true,
        },
      ],
      status: {
        type: String,
        enum: [
          "Pending",
          "Shipped",
          "Out for delivery",
          "Delivered",
          "Cancel",
          "Returned",
        ],
        default: "Pending",
        required: true,
      },
      selectedAddress: {
        type: Array,
        required: true,
      },
      paymentMethod: {
        type: String,
        enum: ["cod", "onlinepayment", "wallet"],
        required: true,
      },
      usedCoupons: [
        {
          coupon: {
            type: String,
          },
        },
      ],
      date: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
  ],
});

// declaring the collection for the report page
const collection = new mongoose.model("reportCollection", stepCrazy);

// exporting the collection
module.exports = collection;
