// ==================>Profile for the user <===============
// modules required for the user profile
const userCollection = require("../../models/user/userDatabase");

// rendring the profile page of the user
exports.getProfilePage = async (req, res) => {
  const user = req.session.user;
  const userProfile = await userCollection.findOne({ email: user });
  res.render("user/profile", { user, userProfile });
};

// rendering the page for adding the address
exports.getAddressAdd = (req, res) => {
  res.render("user/addAddress");
};
