// =========> for the cart details of the user <===========

// requiring the required modules
const mongoose = require("mongoose");

// declaring the schema
const stepCrazy = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userCollection",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  stock: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
    min: 1,
  },
});

// declaring the collection
const collection = new mongoose.model("cart", stepCrazy);

// exporting the collection
module.exports = collection;
