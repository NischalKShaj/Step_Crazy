// importing the userdatabase
const collection = require("../../models/user/userDatabase");

let users;

// setting the routes for the usermanagement page
exports.getUserPage = async (req, res) => {
  const users = await collection.find();
  res.render("admin/usermanagement", { users });
};

// for showing the data of the in user database in the user page
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

// for blocking the user
exports.postBlockeUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by ID and update the 'blocked' field to true
    const user = await collection.findByIdAndUpdate(userId, { blocked: true });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log("The user is blocked successfully...");
    return res.json({ success: true, message: "User blocked successfully" });
  } catch (error) {
    console.error("Error blocking user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// for unblocking the user
exports.postUnblockUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    // Find the user by the ID and the update the 'blocked' field false
    const user = await collection.findByIdAndUpdate(userId, { blocked: false });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    console.log("The user is now unblocked successfully...");
    return res.json({ success: true, message: "User unblocked successfully" });
  } catch (error) {
    console.error("Error blocking the user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
