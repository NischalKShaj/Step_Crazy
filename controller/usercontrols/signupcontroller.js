const express = require("express");
const collection = require("../../models/user/userDatabase");

const router = express.Router();

// posting the login page after signing the user
try{
    exports.postOtpPage = async (req, res) => {
      console.log(req.body.email, req.body.Phone, req.body.password);
      const userDetails = {
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        email : req.body.email,
        phone : req.body.Phone,
        password : req.body.password,
      }
      console.log(userDetails);
      await collection.insertMany([userDetails])
      res.render("otp");
    };

}catch{
    console.log("error occured while entering the values in the database");
}


