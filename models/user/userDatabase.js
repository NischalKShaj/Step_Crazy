// requiring the modules for this page
const mongoose = require("mongoose");

const stepCrazy = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
  referalCode: {
    type: String,
    
  },
  enteredReferal: {
    type: String,
  },
  otp: {
    type: Number,
  },
  cartQuantity: {
    type: Number,
    default: 0,
  },
  address: [
    {
      pincode: {
        type: String,
        required: true,
      },
      locality: {
        type: String,
        required: true,
      },
      fullAddress: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
    },
  ],
  order: [
    {
      cart: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "cart",
          required: true,
        },
      ],
      products: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
      ],
      quantity: [
        {
          type: String,
          required: true,
        },
      ],
      price: [
        {
          type: Number,
          required: true,
        },
      ],
      status: {
        type: String,
        enum: [
          "Pending",
          "Shipped",
          "Out for delivery",
          "Delivered",
          "Cancel",
          "Returned",
        ],
        default: "Pending",
        required: true,
      },
      selectedAddress: {
        type: Array,
        required: true,
      },
      paymentMethod: {
        type: String,
        enum: ["cod", "onlinepayment", "wallet"],
        required: true,
      },
      usedCoupons: [
        {
          coupon: {
            type: String,
          },
        },
      ],
      date: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
  ],
  wallet: {
    type: Number,
    default: 0,
    required: true,
  },
  unUsedCoupons: [
    {
      coupons: {
        type: String,
      },
    },
  ],
  usedCoupons: [
    {
      coupon: {
        type: String,
      },
    },
  ],
  blocked: {
    type: Boolean,
    default: false,
  },
});

// declaring the collection name
const collection = new mongoose.model("userCollection", stepCrazy);

// exporting the database
module.exports = collection;
