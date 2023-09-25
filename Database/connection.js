// js file where the database is connected

// importing the modules for connecting to the mongodb server
const mongoose = require('mongoose')

// connecting to the mongodb
mongoose.connect("mongodb://localhost:27017/stepCrazy")
.then(()=>{
    console.log("Connection Success....");
})
.catch(()=>{
    console.log("Connection error....");
})

module.exports = mongoose;