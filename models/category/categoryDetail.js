// importing the modules for the database

const mongoose = require("mongoose");

// declaring the schema for the collection
const stepCrazy = new mongoose.Schema({
  Id:{
    type: String,
    requried: true,
  },
  Type: [
    {
      type: String,
      required: true,
    },
  ],
  Brand: [
    {
      type: String,
      required: true,
    },
  ],
  Gender: [
    {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
  ],
});

// declaring the collection for the module
const collection = new mongoose.model("Category", stepCrazy);

// exporting the modules
module.exports = collection;
