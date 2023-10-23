// modules required for the collection
const mongoose = require("mongoose");

// schema for the collection
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
});

// creating the collection
const collection = new mongoose.model("wishlist", stepCrazy);

// exporting the collection
module.exports = collection;
