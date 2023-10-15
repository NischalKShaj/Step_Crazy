// ==================> Profile for the user <===============
// modules required for the user profile
const userCollection = require("../../models/user/userDatabase");

let userAddress;
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

// for redirecting to the profile page
exports.postProfilePage = async (req, res) => {
  try {
    const filter = { email: req.body.email };
    const userAddress = {
      pincode: req.body.pincode,
      locality: req.body.locality,
      fullAddress: req.body.fullAddress,
      city: req.body.city,
      state: req.body.state,
    };
    const update = {
      $push: {
        address: userAddress,
      },
    };

    console.log(userAddress);
    await userCollection.updateOne(filter, update);

    res.redirect("/profile");
  } catch (error) {
    res.redirect("/profile/add-address");
  }
};

// router to show the address page
exports.getAddressPage = async (req, res) => {
  const address = req.session.user;
  console.log(address);
  const userAdd = await userCollection.find({ email: address });
  console.log(userAdd);
  res.render("user/showAddress", { address, userAdd });
};

// router for editing the user profile
exports.getProfileEdit = (req, res) => {
  let id = req.params.id;
  userCollection
    .findById(id)
    .then((user) => {
      if (!user) {
        res.redirect("/profile");
      } else {
        res.render("user/editProfile", { user: user });
      }
    })
    .catch((error) => {
      console.log("Error finding the user....");
      res.redirect("/profile");
    });
};

// router for updating the user profile
exports.postProfileEdit = async (req, res) => {
  try {
    let id = req.params.id;

    const updateProfile = await userCollection.findByIdAndUpdate(id, {
      first_name: req.body.first_name,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
    });

    console.log(updateProfile);
    res.redirect("/profile");
  } catch (error) {
    res.redirect("/profile/edit-profile/");
    console.log("There is an error while updating the values....");
  }
};

// router for editing the address of the user
exports.getAddressEdit = (req, res) => {
  let id = req.params.id;
  userCollection
    .findById(id)
    .then((address) => {
      if (!address) {
        res.redirect("/profile");
      } else {
        res.render("user/editAddress", { address: address });
      }
    })
    .catch((error) => {
      console.log("Error finding the user....");
      res.redirect("/profile");
    });
};

exports.postNewAddress = async (req, res) => {
  try {
    // Extract the address data from the request body
    const { fullAddress, city, locality, state, pincode } = req.body;

    // Get the user's email from the session (you need to implement this)
    const userEmail = req.session.user;

    // Find the user by their email
    const user = await userCollection.findOne({ email: userEmail });

    if (user) {
      // Initialize the address array if it's undefined
      if (!user.address) {
        user.address = [];
      }

      // Create an address object
      const newAddress = {
        fullAddress,
        city,
        locality,
        state,
        pincode,
      };

      // Add the new address to the user's address array
      user.address.push(newAddress);

      // Save the user's updated information
      await user.save();

      res.json({ success: true });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "An error occurred while saving the address",
    });
  }
}