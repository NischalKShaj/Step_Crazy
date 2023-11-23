// ===============================> file for controlling the banners <=======================//

// modules required for the file
const multer = require("multer");
const bannerCollection = require("../../models/banner/bannerDetail");

// storing the images in the database
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

// uploading the images in the database
exports.uploads = multer({
  storage: storage,
}).array("image");

// controller for geting the banner
exports.getBanner = async (req, res) => {
  const admin = req.session.admin;
  if (admin) {
    const banner = await bannerCollection.find();
    res.render("admin/banner", { banner });
  } else {
    res.redirect("/admin");
  }
};

// controller for getting the page for adding the banner
exports.getAddBanner = async (req, res) => {
  const admin = req.session.admin;
  try {
    if (admin) {
      res.render("admin/add_banner", { error: null });
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    res.render("error/500");
  }
};

// controller for adding the value to the database
exports.postBannerPage = async (req, res) => {
  const admin = req.session.admin;
  try {
    if (admin) {
      const existingBanner = await bannerCollection.findOne({
        name: req.body.name,
      });
      if (existingBanner) {
        res.render("admin/add_banner", {
          error: "Banner already exists",
        });
      } else {
        const imageArray = [];
        for (const file of req.files) {
          imageArray.push(file.filename);
        }
        const bannerDetails = {
          name: req.body.name,
          description: req.body.description,
          image: imageArray,
        };
        await bannerCollection.insertMany([bannerDetails]);
        res.redirect("/admin/dashboard/banner");
      }
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    res.render("error/500");
  }
};

// controller for editing the banner
exports.getUpdateBanner = async (req, res) => {
  const admin = req.session.admin;
  if (admin) {
    const id = req.params.id;
    bannerCollection
      .findById(id)
      .then((banner) => {
        if (!banner) {
          res.redirect("/admin/dashboard/banner");
        } else {
          res.render("admin/edit_banner", { banner: banner });
        }
      })
      .catch((error) => {
        res.render("error/500");
      });
  } else {
    res.redirect("/admin");
  }
};

// controller for updating the banner
exports.postUpdatedBanner = async (req, res) => {
  const admin = req.session.admin;
  if (admin) {
    const id = req.params.id;
    const bannerDetail = await bannerCollection.findByIdAndUpdate(id, {
      name: req.body.name,
      description: req.body.description,
    });
    if (req.files) {
      const newImages = req.files.map((file) => file.filename);
      bannerDetail.image = bannerDetail.image.concat(newImages);
    }
    await bannerDetail.save();
    res.redirect("/admin/dashboard/banner");
  } else {
    res.render("error/500");
  }
};

// controller for deleting the banner
exports.deleteBanner = async (req, res) => {
  const admin = req.session.admin;
  const bannerId = req.params.bannerId;
  try {
    if (admin) {
      const bannerDetail = await bannerCollection.findByIdAndDelete(bannerId);
      if (!bannerDetail) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      return res.status(200).json({ message: "Coupon deleted successfully" });
    }
  } catch (error) {
    res.render("error/500");
  }
};

// controller for deleting the image in the banner
exports.deleteImage = async (req, res) => {
  const admin = req.session.admin;
  if (admin) {
    try {
      const image = req.params.image;
      const bannerId = req.params.bannerId;
      const updatedBanner = await bannerCollection.findByIdAndUpdate(
        bannerId,
        { $pull: { image: image } },
        { new: true }
      );
      res.redirect(`/admin/dashboard/banner/edit/${bannerId}`);
    } catch (error) {
      res.render("error/500");
    }
  } else {
    res.redirect("/admin");
  }
};
