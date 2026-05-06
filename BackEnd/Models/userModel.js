const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userSchema = new schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true
  },

  password: {
    type: String,
    default: null
  },

  googleAuth: {
    type: Boolean,
    default: false
  },

  picture: {
    type: String,
    default: ""
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

});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;