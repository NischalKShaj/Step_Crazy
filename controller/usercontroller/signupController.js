// requiring the local and other dependecies for the project
const nodemailer = require("nodemailer");
const express = require("express");
const collection = require("../../models/user/userDatabase");

let otp;
let userDetails;
const router = express.Router();

//  Create a Nodemailer transporter for sending OTP emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nischalkshaj5@gmail.com",
    pass: "scojovjuumwsqxnm",
  },
});

// store generated otp and the mails
const optMap = new Map();

// generate a random otp

const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};
exports.getOtpPage = (req, res) => {
  res.render("home/otp");
};
// posting the login page after signing the user
let flag= true
try {
  exports.postOtpPage = async (req, res) => {
    const check = await collection.find({},{email:1,_id:0})
    console.log(check[0].email);
    for(let i = 0; i<check.length;i++){
      if(check[i].email === req.body.email){
        console.log("running");
        
        
         flag = false;
        break;
    } 
  }
  if(flag === false){
    console.log("running2");
    const successMessage = 'User already exists..'
        
        
    res.redirect(`/signup?success=${encodeURIComponent(successMessage)}`)
    return
  } else {
    console.log(req.body.email, req.body.Phone, req.body.password);
    userDetails = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      gender : req.body.gender,
      email: req.body.email,
      phone: req.body.Phone,
      password: req.body.password,
    };

    otp = generateOtp();
    console.log(otp);
    optMap.set(userDetails.email, otp);

    // configuring the email
    const mailOptions = {
      from: "nischalkshaj5@gmail.com",
      to: userDetails.email,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}. Please don't share your otp with others`,
    };
    // sending the email to the specified email address
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to send OTP" });
      } else {
        console.log("OTP sent: " + info.response);
        res.status(200).json({ message: "OTP sent successfully" });
      }
    });

    res.redirect("/signup/otp");
  }
    
  
  };
} catch(error) {
  // res.redirect("/signup");
  console.log("error occured while entering the values in the database",error);
}

// inserting the value to the database if the otp is valid
exports.checkOtp = async (req, res) => {
  const OTP = req.body.otp;
  console.log(OTP, otp);
  if (otp === OTP) {
    console.log(userDetails);

    await collection.insertMany([userDetails]);
    // sending the confirmation mail to the user
    const mailContent = {
      from: "nischalkshaj5@gmail.com",
      to: userDetails.email,
      subject: "User Registration Success",
      text: "Thank you for choosing Step Crazy, you have successfully registered with Step Crazy. Enjoy shopping with us.",
    };
    
    // sending the email to the specified email address
    transporter.sendMail(mailContent, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to register user" });
      } else {
        console.log("user registered");
        res.status(200).json({ message: "User registration success" });
      }
    });
    res.redirect("/login");
  } else {
    res.redirect("/signup/otp");
  }
};
