// ====================================> offer model <=====================================

// importing the modules
const mongoose = require("mongoose");

// declaring the schema for the collection
const stepCrazy = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  expiryDate: {
    type: String,
    required: true,
  },
});

// declaring the collection
const collection = new mongoose.model("offer", stepCrazy);

// exporting the collection
module.exports = collection;
