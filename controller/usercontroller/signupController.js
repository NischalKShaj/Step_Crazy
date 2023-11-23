// requiring the local and other dependecies for the project
const nodemailer = require("nodemailer");
const express = require("express");
const collection = require("../../models/user/userDatabase");
const temporaryCollection = require("../../models/temporary/temporaryDetails");

//  Create a Nodemailer transporter for sending OTP emails
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nischalkshaj5@gmail.com",
      pass: "scojovjuumwsqxnm",
    },
  });
};

// generate a random otp
const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// controller for getting the otp page
exports.getOtpPage = (req, res) => {
  res.render("home/otp");
};

// posting the login page after signing the user
exports.postOtpPage = async (req, res) => {
  try {
    const transporter = createTransporter(); // Create a transporter for sending OTP emails
    const otp = generateOtp();

    // Check if the email already exists in the collection
    const existingUser = await collection.findOne({ email: req.body.email });

    if (existingUser) {
      const successMessage = "User already exists..";
      res.redirect(`/signup?success=${encodeURIComponent(successMessage)}`);
      return;
    }

    req.session.email = req.body.email;

    const userDetails = {
      email: req.body.email,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      gender: req.body.gender,
      phone: req.body.Phone,
      password: req.body.password,
      otp: otp,
    };

    // Store the generated OTP and user details in the session
    const check = await temporaryCollection.insertMany([userDetails]);

    // Configure the email options
    const mailOptions = {
      from: "nischalkshaj5@gmail.com",
      to: userDetails.email,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}. Please don't share your otp with others`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(500).json({ message: "Failed to send OTP" });
      } else {
        res.status(200).json({ message: "OTP sent successfully" });
      }
    });
    res.redirect("/signup/otp");
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// controller for checking the otp
exports.checkOtp = async (req, res) => {
  const enteredOTP = req.body.otp;

  const temporary = await temporaryCollection.findOne({ otp: enteredOTP });

  const check = temporary.otp;

  if (check == enteredOTP) {
    await collection.insertMany([temporary]);

    const transporter = createTransporter(); // Create a transporter for sending confirmation emails

    const mailContent = {
      from: "nischalkshaj5@gmail.com",
      to: temporary.email,
      subject: "User Registration Success",
      text: "Thank you for choosing Step Crazy, you have successfully registered with Step Crazy. Enjoy shopping with us.",
    };
    await temporaryCollection.deleteOne({ otp: enteredOTP });

    // Clear the session
    req.session.destroy((err) => {
      if (err) {
        res.render("error/500");
      }
    });
    transporter.sendMail(mailContent, (error, info) => {
      if (error) {
        res.status(500).json({ message: "Failed to register user" });
      } else {
        res.status(200).json({ message: "User registration success" });
      }
    });
    res.redirect("/login");
  } else {
    res.redirect("/signup/otp");
  }
};

// controller for the otp resend
exports.getOtpResend = async (req, res) => {
  try {
    const transporter = createTransporter();
    const otp = generateOtp();

    const userEmail = req.session.email;

    const temporary = await temporaryCollection.findOne({ email: userEmail });

    // Check if the email already exists in the collection
    const existingUser = await collection.findOne({ email: req.body.email });

    if (existingUser) {
      const successMessage = "User already exists..";
      res.redirect(`/signup?success=${encodeURIComponent(successMessage)}`);
      return;
    }

    const userDetails = await temporaryCollection.findOneAndUpdate(
      { email: temporary.email },
      { $set: { otp: otp } }
    );

    // Configure the email options
    const mailOptions = {
      from: "nischalkshaj5@gmail.com",
      to: userDetails.email,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}. Please don't share your otp with others`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(500).json({ message: "Failed to send OTP" });
      } else {
        res.status(200).json({ message: "OTP sent successfully" });
      }
    });
    res.redirect("/signup/otp");
  } catch (error) {
    console.error("There was an error while checking the resend otp", error);
    res.render("error/500");
  }
};
