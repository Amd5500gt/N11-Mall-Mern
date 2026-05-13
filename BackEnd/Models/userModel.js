const mongoose = require("mongoose");

/* ================= ADDRESS SCHEMA ================= */

const addressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: Number,
      default: null,
    },

    addressLine1: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    state: {
      type: String,
      trim: true,
      default: "",
    },

    pincode: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

/* ================= CONTACT SCHEMA ================= */

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },

    phone: {
      type: Number,
      default: null,
    },

    message: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

/* ================= USER SCHEMA ================= */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      default: null,
    },

    passwordResetOTP: {
      type: String,
      default: null,
    },

    passwordResetOTPExpire: {
      type: Date,
      default: null,
    },
    isOTPVerified: {
      type: Boolean,
      default: false
    },
    otpAttempts: {
      type: Number,
      default: 0
    },
    picture: {
      type: String,
      default: "",
    },

    googleId: {
      type: String,
      sparse: true,
      default: null,
    },

    googleAuth: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    address: {
      type: addressSchema,
      default: () => ({}),
    },

    contact: {
      type: contactSchema,
      default: () => ({}),
    },

    cart: [
      {
        productId: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
    orders: [
  {
    type:
      mongoose.Schema.Types.ObjectId,

    ref: "orders",
  },
],
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;