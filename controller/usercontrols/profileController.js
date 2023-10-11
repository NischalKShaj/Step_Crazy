// ==================>Profile for the user <===============
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
    userAddress = {
      address: [
        {
          pincode: req.body.pincode,
          locality: req.body.locality,
          fullAddress: req.body.fullAddress,
          city: req.body.city,
          state: req.body.state,
        },
      ],
    };
    const option = { upsert: true };
    console.log(userAddress);
    await userCollection.updateOne(filter, userAddress, option);

    res.redirect("/profile");
  } catch (error) {
    res.redirect("/profile/add-address");
  }
};

// router to show the address page
exports.getAddressPage = async (req, res) => {
  const address = req.session.user;
  const userAdd = await userCollection.findOne({ email: address });
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
      email : req.body.email,
      phone: req.body.phone,
      gender:req.body.gender
     
    });
    
    console.log(updateProfile);
    res.redirect("/profile");
  } catch (error) {
    res.redirect("/profile/edit-profile/");
    console.log("There is an error while updating the values....");
  }
};
