// requiring the modules for this page
const mongoose = require('mongoose')

const stepCrazyUser = new mongoose.Schema({
    first_name : {
        type : String,
        required : true,
    },
    last_name : {
        type : String,
        required : true,
    },
    phone : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    address : {
        house_num : {
            type : String,
            required : true,
        },
        street : {
            type : String,
            required : true,
        },
        locality : {
            type : String,
            required : true,
        },
        landmark : {
            type : String,
            required : false,
        },
        district : {
            type : String,
            required : true,
        },
        state : {
            type : String,
            required : true
        }
    },
    pincode : {
        type : Number,
        required  :true,
    },
    created :{
        type : Date,
        required : true,
        default : Date.now,
    }

})

// declaring the collection name 
const collection = new mongoose.model("userCollection",stepCrazyUser)

// exporting the database to app.js
module.exports  =  collection