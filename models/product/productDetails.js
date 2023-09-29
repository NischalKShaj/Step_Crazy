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
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  stock: {
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
