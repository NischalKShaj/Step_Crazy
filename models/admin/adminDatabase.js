// requiring the modules for the file

const mongoose = require("mongoose");

// defining the schema for the admin database

const stepCrazy = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// declaring the collection for the database
const collection = new mongoose.model("admin", stepCrazy);

// exporting the database
module.exports = collection;
