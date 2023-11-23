// ========================> coupon collection <=======================

// modules required for the collection
const mongoose = require("mongoose");

// declaring the schema for the collection
const stepCrazy = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  minAmount: {
    type: Number,
    required: true,
  },
  maxAmount: {
    type: String,
    required: true,
  },
  flatDiscount: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

// declaring the collection
const collection = new mongoose.model("coupon", stepCrazy);

// exporting the collection
module.exports = collection;
