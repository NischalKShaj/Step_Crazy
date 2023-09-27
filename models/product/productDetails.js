// requring the module for the collection
const mongoose = require("mongoose");



const stepCrazy = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: [
    {
      data: Buffer,
      type: String,
      required: true,
    },
  ],
  category: [
    {
      type: String,
      required: true,
    },
  ],
});

// declaring the collection for the database
const collection = new mongoose.model("product", stepCrazy);

// exporting the database
module.exports = collection;
