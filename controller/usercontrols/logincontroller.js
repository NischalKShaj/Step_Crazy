// login authentication for the website

// requiring the important modules for the js file
const express = require("express");
const router = express.Router();

const collection = require("../../models/user/userDatabase");


exports.postHomePage = async (req, res) => {
  try {
    const data = await collection.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    console.log(data);
    if (data.email === req.body.email && data.password === req.body.password) {
      res.redirect("/");
    }
  } catch {
    res.redirect("/login");
  }
};


