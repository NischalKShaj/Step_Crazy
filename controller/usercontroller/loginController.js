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

    if (
      data.email === req.body.email &&
      data.password === req.body.password &&
      data.blocked === false
    ) {
      req.session.user = req.body.email;
      res.redirect("/");
    } else if (
      data.email === req.body.email &&
      data.password === req.body.password &&
      data.blocked === true
    ) {
      const message = "User blocked";
      res.render("user/login", { message });
    } else {
      const message = "Invalid username or password";
      res.render("user/login", { message });
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
try {
  exports.postOTP = async (req, res) => {
    let flag = true;
    const check = await collection.find({}, { email: 1, _id: 0 });

    for (let i = 0; i < check.length; i++) {
      if (check[i].email === req.body.email) {
        flag = false;
        break;
      }
    }
    if (flag === false) {
      userDetails = {
        email: req.body.email,
        password: req.body.password,
      };

      const otp = generateOtp();

      optMap.set(userDetails.email, otp);
      try {
        await collection.updateOne(
          { email: userDetails.email },
          { $set: { otp: otp } }
        );
      } catch (error) {
        return;
      }

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
          res.status(500).json({ message: "Failed to send OTP" });
        } else {
          res.status(200).json({ message: "OTP sent successfully" });
        }
      });

      res.render("user/otp");
    } else {
      const successMessage = "User doesnot exists..";

      res.redirect(`/login?success=${encodeURIComponent(successMessage)}`);
      return;
    }
  };
} catch {
  res.redirect("/login");
}

// to update the password
exports.postForgotLogin = async (req, res) => {
  try {
    const otp = await collection.findOne({ email: userDetails.email });
    const OTP = req.body.otp;
    if (otp.otp == OTP) {
      const filter = { email: userDetails.email };
      // const update = { password: userDetails.password };
      const update = {
        $set: { password: userDetails.password },
        $unset: { otp: 1 }, // Unset the 'otp' field
      };
      // sending the confirmation mail to the user
      mailContent = {
        from: "nischalkshaj5@gmail.com",
        to: userDetails.email,
        subject: "User password is changed successfully",
        text: "Your password is changed successfully now you can change use the changed password while loggin in.",
      };

      // sending the email to the specified email address
      transporter.sendMail(mailContent, (error, info) => {
        if (error) {
          res.status(500).json({ message: "Failed to register user" });
        } else {
          res.status(200).json({ message: "User registration success" });
        }
      });
      res.redirect("/login/passwordOTP");
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.status(500).send("Error updating the value: " + error);
  }
};

// router for redirecting to the loginpage after entering the otp
exports.getOTP = (req, res) => {
  res.redirect("/login");
};
