// requiring the local and other dependecies for the project
const nodemailer = require("nodemailer");
const express = require("express");
const collection = require("../../models/user/userDatabase");

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
    console.log(`OTP sent: ${otp}`);

    // Check if the email already exists in the collection
    const existingUser = await collection.findOne({ email: req.body.email });

    if (existingUser) {
      console.log("User already exists");
      const successMessage = "User already exists..";
      res.redirect(`/signup?success=${encodeURIComponent(successMessage)}`);
      return;
    }

    console.log(req.body.email, req.body.Phone, req.body.password);
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
    req.session.userDetailsArray = req.session.userDetailsArray || [];
    req.session.userDetailsArray.push(userDetails);

    // Configure the email options
    const mailOptions = {
      from: "nischalkshaj5@gmail.com",
      to: userDetails.email,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}. Please don't share your otp with others`,
    };

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
  } catch (error) {
    console.log(
      "Error occurred while entering the values in the database",
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

// controller for checking the otp 
exports.checkOtp = async (req, res) => {
  const enteredOTP = req.body.otp;

  console.log(
    `entered otp: ${enteredOTP} userdetailsArry: ${JSON.stringify(
      req.session.userDetailsArray
    )}`
  );

  const userDetailsIndex = req.session.userDetailsArray.findIndex(
    (user) => user.otp === enteredOTP
  );

  if (userDetailsIndex !== -1) {
    const userDetails = req.session.userDetailsArray[userDetailsIndex];

    console.log(userDetails);

    await collection.insertMany([userDetails]);
    await collection.updateOne(
      { email: userDetails.email },
      { $unset: { otp: 1 } }
    );

    // Remove the used OTP from the session
    req.session.userDetailsArray.splice(userDetailsIndex, 1);

    const transporter = createTransporter(); // Create a transporter for sending confirmation emails

    const mailContent = {
      from: "nischalkshaj5@gmail.com",
      to: userDetails.email,
      subject: "User Registration Success",
      text: "Thank you for choosing Step Crazy, you have successfully registered with Step Crazy. Enjoy shopping with us.",
    };

    transporter.sendMail(mailContent, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to register user" });
      } else {
        console.log("User registered");

        res.status(200).json({ message: "User registration success" });
      }
    });

    res.redirect("/login");
  } else {
    res.redirect("/signup/otp");
  }
};
