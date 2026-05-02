const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,        // duplicate email nahi aayega
    trim: true
  },

  number: {
    type: String,        // better than Number (leading 0 issue avoid)
    required: true,
    minlength: 10,
    maxlength: 10
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  }

}, { timestamps: true });  // createdAt, updatedAt auto

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;