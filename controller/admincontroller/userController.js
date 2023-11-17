// importing the userdatabase
const collection = require("../../models/user/userDatabase");

let users;

// setting the routes for the usermanagement page
exports.getUserPage = async (req, res) => {
  const search = req.query.search;
  const page = parseInt(req.query.page) || 1;
  const ITEMS_PER_PAGE = 10;
  const limit = ITEMS_PER_PAGE;
  const skip = (page - 1) * limit;
  const query = {};
  const admin = req.session.admin;

  try {
    if (admin) {
      if (search) {
        query.$or = [
          { first_name: { $regex: ".*" + search + ".*", $options: "i" } },
          { last_name: { $regex: ".*" + search + ".*", $options: "i" } },
          { email: { $regex: ".*" + search + ".*", $options: "i" } },
        ];
      }

      // Fetch users with pagination
      const users = await collection.find(query).skip(skip).limit(limit);

      // Calculate total count of users for pagination
      const totalCount = await collection.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit);

      res.render("admin/usermanagement", { users, totalPages, currentPage: page });
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.error("There is an unexpected error while fetching users", error);
    res.render("error/500");
  }
};

// for showing the data of the in user database in the user page
exports.postUserPage = (req, res) => {
  const admin = req.session.admin;
  if (admin) {
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
  } else {
    res.redirect("/admin");
  }
};

// for blocking the user
exports.postBlockeUser = async (req, res) => {
  const userId = req.params.userId;
  const admin = req.session.admin;
  if (admin) {
    try {
      // Find the user by ID and update the 'blocked' field to true
      const user = await collection.findByIdAndUpdate(userId, {
        blocked: true,
      });

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
  } else {
    res.redirect("/admin");
  }
};

// for unblocking the user
exports.postUnblockUser = async (req, res) => {
  const admin = req.session.admin;
  const userId = req.params.userId;
  if (admin) {
    try {
      // Find the user by the ID and the update the 'blocked' field false
      const user = await collection.findByIdAndUpdate(userId, {
        blocked: false,
      });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      console.log("The user is now unblocked successfully...");
      return res.json({
        success: true,
        message: "User unblocked successfully",
      });
    } catch (error) {
      console.error("Error blocking the user:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } else {
    res.redirect("/admin");
  }
};
