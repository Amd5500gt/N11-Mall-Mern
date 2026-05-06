const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        default: null // Allow null for Google auth users
    },
    picture: {
        type: String,
        default: null
    },
    googleId: {
        type: String,
        sparse: true // Allows multiple null values
    },
    googleAuth: {
        type: Boolean,
        default: false
    },
    
  cart: [
    {
      productId: Number,

      quantity: {
        type: Number,
        default: 1
      }
    }
  ]

}, { timestamps: true });

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;