// login authentication for the website

// requiring the important modules for the js file
const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

const collection = require("../../models/user/userDatabase");

let otp;
let userDetails;
let mailContent;

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

// checking the values in the database
exports.postHomePage = async (req, res) => {
  try {
    const data = await collection.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    console.log(data);
    if (
      data.email === req.body.email &&
      data.password === req.body.password &&
      data.blocked === false
    ) {
      req.session.user = req.body.email;
      res.redirect("/");
    } else {
      const message = "Invalid username or password";
      res.redirect(`/login?success=${encodeURIComponent(message)}`);
    }
  } catch {
    const message = "Invalid username or password";
    res.redirect(`/login?success=${encodeURIComponent(message)}`);
  }
};

// roueter for forget password
exports.getForgetPassword = (req, res) => {
  res.render("user/forgetPassword");
};

// router for entering the password for otp for forgot password
let flag = true;
try {
  exports.postOTP = async (req, res) => {
    const check = await collection.find({}, { email: 1, _id: 0 });
    console.log(check[0].email);
    for (let i = 0; i < check.length; i++) {
      if (check[i].email === req.body.email) {
        console.log("running");

        flag = false;
        break;
      }
    }
    if (flag === false) {
      console.log(req.body.email, req.body.password);
      userDetails = {
        email: req.body.email,
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

      res.render("user/otp");
    } else {
      console.log("running2");
      const successMessage = "User doesnot exists..";

      res.redirect(`/login?success=${encodeURIComponent(successMessage)}`);
      return;
    }
  };
} catch {
  res.redirect("/login");
  console.log("error occured while entering the values in the database");
}

// to update the password
exports.postForgotLogin = async (req, res) => {
  try{

    const OTP = req.body.otp;
    console.log(OTP, otp);
    if (otp === OTP) {
      console.log(userDetails);
        const filter = {email:userDetails.email}
        const update = {password :userDetails.password}
        console.log(filter,update);
        const updateResult = await collection.findOneAndUpdate(filter, {$set:update});
      
        
        console.log(userDetails.email,userDetails.password);
        // sending the confirmation mail to the user
          mailContent = {
          from: "nischalkshaj5@gmail.com",
          to: userDetails.email,
          subject: "User password is changed successfully",
          text: "Your password is changed successfully now you can change use the changed password while loggin in.",
        };
        console.log("password changed successfully");
      
  
      
  
      // sending the email to the specified email address
      transporter.sendMail(mailContent, (error, info) => {
        if (error) {
          // console.log(error);
          res.status(500).json({ message: "Failed to register user" });
        } else {
          console.log("user registered");
          res.status(200).json({ message: "User registration success" });
        }
      });
      res.redirect("/login/passwordOTP");
    } else {
      res.redirect("/login");
    }
  }catch(error){
    res.send("eror updating the value",error)
  }
};

// router for redirecting to the loginpage after entering the otp
exports.getOTP = (req, res) => {
  res.redirect("/login");
};

