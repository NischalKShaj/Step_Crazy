// importing the userdatabase
const collection = require("../../models/user/userDatabase");

let users;

// setting the routes for the usermanagement page
exports.getUserPage = async(req, res) => {
  const users = await collection.find()
  res.render("admin/usermanagement",{users});
};

exports.postUserPage = (req, res) => {
  collection
    .find()
    .exec()
    .then((users) => {
      res.redirect("/dashboard/user");
    })
    .catch((err) => {
      console.error("Error querying users:", err);
      res.status(500).send("Internal Server Error");
    });
};
