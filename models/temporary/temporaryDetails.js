// ===============================> temporary schema for storing the user details <=================================

// importing the modules required
const mongoose = require("mongoose");

// declaring the schema for the collection
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
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
  otp: {
    type: Number,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
});

// declaring the collection for the schema
const collection = new mongoose.model("temporaryCollection", stepCrazy);

// exporting the collection
module.exports = collection;
