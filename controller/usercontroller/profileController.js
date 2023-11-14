// ==================> Profile for the user <===============
// modules required for the user profile
const userCollection = require("../../models/user/userDatabase");

// middleware to check the session for the profile
exports.reqAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

let userAddress;
// rendring the profile page of the user
exports.getProfilePage = async (req, res) => {
  const user = req.session.user;
  const userProfile = await userCollection.findOne({ email: user });
  if (user && userProfile.blocked === false) {
    res.render("user/profile", { user, userProfile });
  } else {
    res.redirect("/login");
  }
};

// rendering the page for adding the address
exports.getAddressAdd = (req, res) => {
  res.render("user/addAddress");
};

// for redirecting to the profile page
exports.postProfilePage = async (req, res) => {
  const user = req.session.user;
  console.log("user",user);
  const User = await userCollection.find({ email: user });
  console.log("User", User);
  try {
    if (user) {
      const filter = { email: user };
      console.log("filter",filter);
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
    }
  } catch (error) {
    console.error("error while adding the porfile", error);
    res.redirect("/profile/add-address");
  }
};

// router to show the address page
exports.getAddressPage = async (req, res) => {
  const user = req.session.user;

  if (user) {
    const address = req.session.user;
    id = req.params.id;

    console.log(address);
    const userAdd = await userCollection.find({ email: address });
    console.log(userAdd);
    res.render("user/showAddress", { address, userAdd });
  } else {
    res.redirect("/login");
  }
};

// router for editing the user profile
exports.getProfileEdit = (req, res) => {
  const id = req.params.id;

  userCollection
    .findById(id)
    .then((user) => {
      if (!user) {
        res.redirect("/profile");
      } else if (user && user.blocked === false) {
        res.render("user/editProfile", { user: user });
      } else {
        res.redirect("/login");
      }
    })
    .catch((error) => {
      console.log("Error finding the user....", error);
      res.redirect("/profile");
    });
};

// router for updating the user profile
exports.postProfileEdit = async (req, res) => {
  const userId = req.session.user;
  try {
    if (userId) {
      const id = req.params.id;

      const updateProfile = await userCollection.findByIdAndUpdate(id, {
        first_name: req.body.first_name,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
      });

      console.log(updateProfile);
      res.redirect("/profile");
    } else {
      // If the session does not exist, redirect the user to a login or access-denied page.
      res.redirect("/login"); // or res.redirect("/access-denied");
    }
  } catch (error) {
    console.log("There is an error while updating the values....", error);
    res.redirect("/profile/edit-profile/");
  }
};

// router for editing the address of the user
exports.getAddressEdit = async (req, res) => {
  const user = req.session.user; // Session data

  if (user) {
    const addressId = req.params.id; // Assuming the address ID is passed in the URL

    await userCollection
      .findOne({ email: user }) // Find a user by their email
      .then((userAddress) => {
        if (!userAddress) {
          console.log("User not found");
          res.redirect("/login");
        } else {
          // Find the specific address based on the addressId
          const address = userAddress.address.find(
            (addr) => addr.id === addressId
          );

          if (!address) {
            console.log("Address not found");
            res.redirect("/login");
          } else {
            console.log(address);
            res.render("user/editAddress", { userAddress, address });
          }
        }
      })
      .catch((error) => {
        console.log("Error finding the user....", error);
        res.redirect("/login");
      });
  } else {
    console.log("User not authenticated");
    res.redirect("/login");
  }
};

// controller for updating the edited address of the user
exports.postAddressEdit = async (req, res) => {
  const userId = req.session.user;
  try {
    if (userId) {
      const addressId = req.params.id;
      console.log(addressId);
      const filter = { "address._id": addressId };
      const update = {
        $set: {
          "address.$.pincode": req.body.pincode,
          "address.$.locality": req.body.locality,
          "address.$.fullAddress": req.body.fullAddress,
          "address.$.city": req.body.city,
          "address.$.state": req.body.state,
        },
      };
      const result = await userCollection.updateOne(filter, update);

      res.redirect("/profile/address");
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error("There is an error while updating the address", error);
    res.redirect("/profile");
  }
};

// for adding the new address to the user
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

      console.log(newAddress);
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
};
