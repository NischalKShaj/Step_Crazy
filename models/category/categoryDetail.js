// importing the modules for the database

const mongoose = require("mongoose");

// declaring the schema for the collection
const stepCrazy = new mongoose.Schema({
  category: 
    {
      type: String,
      required: true,
      
    },
  
});

// declaring the collection for the module
const collection = new mongoose.model("Category", stepCrazy);

// exporting the modules
module.exports = collection;
