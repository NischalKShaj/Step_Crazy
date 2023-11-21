// =====================================> controller for doing the offers <================================//

// modules required for this js file
const categoryCollection = require("../../models/category/categoryDetail");
const offerCollection = require("../../models/offer/offerDetails");

// controller for getting the offer page
exports.getOfferPage = async (req, res) => {
  try {
    const offer = await offerCollection.find();
    res.render("admin/offer", { offer });
  } catch (error) {
    res.render("error/500");
  }
};

// controller for getting the offer adding page
exports.getOfferAddPage = async (req, res) => {
  try {
    const category = await categoryCollection.find();
    res.render("admin/add_offer", { category, error: null });
  } catch (error) {
    res.render("error/500");
  }
};

// controller for adding the value in the offer page
exports.postOfferPage = async (req, res) => {
  try {
    const existingOffer = await offerCollection.findOne({
      category: req.body.category,
    });
    const category = await categoryCollection.find();
    if (existingOffer) {
      res.render("admin/add_offer", {
        category,
        error: "Offer already exists",
      });
    } else {
      const offer = {
        category: req.body.category,
        expiryDate: req.body.expiryDate,
        discount: req.body.discount,
      };
      await offerCollection.insertMany([offer]);
    }
    res.redirect("/admin/dashboard/offer");
  } catch (error) {
    res.render("error/500");
  }
};

// controller for getting the edit page for the offer
exports.getEditPage = async (req, res) => {
  const id = req.params.id;
  try {
    const category = await categoryCollection.find();
    const offer = await offerCollection.findById(id);
    res.render("admin/edit_offer", { offer, category });
  } catch (error) {
    res.render("error/500");
  }
};

// controller for updating the value in the collection
exports.updateOffer = async (req, res) => {
  const id = req.params.id;
  try {
    const offers = await offerCollection.findOneAndUpdate({
      category: req.body.category,
      discount: req.body.discount,
      expiryDate: req.body.expiryDate,
    });
    await offers.save();
    res.redirect("/admin/dashboard/offer");
  } catch (error) {
    res.render("error/500");
  }
};

// controller for deleting the offer
exports.deleteOffer = async (req, res) => {
  const offerId = req.params.offerId;
  try {
    const deletedOffer = await offerCollection.findByIdAndRemove(offerId);

    if (!deletedOffer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    return res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    res.render("error/500");
  }
};
