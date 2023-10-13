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
  quantity: {
    type: Number,
    default: 1,
    requied: true,
  },
});

// declaring the collection
const collection = new mongoose.model("cart", stepCrazy);

// exporting the collection
module.exports = collection;
