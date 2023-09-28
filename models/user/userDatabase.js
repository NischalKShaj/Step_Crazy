// requiring the modules for this page
const mongoose = require("mongoose");

const stepCrazy = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender:{
    type : String,
    enum: ["Male", "Female"], 
    required : true,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// declaring the collection name
const collection = new mongoose.model("userCollection", stepCrazy);

// exporting the database to app.js
module.exports = collection;
