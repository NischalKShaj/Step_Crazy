// =================================> models for the banner <==========================================//

// modules required for the files
const mongoose = require("mongoose");

// declarring the schema
const stepCrazy = new mongoose.Schema({
  image: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

// declaring the collection for banner management
const collection = new mongoose.model("banner", stepCrazy);

// exporting the modules
module.exports = collection;
