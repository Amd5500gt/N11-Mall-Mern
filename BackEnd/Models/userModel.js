const mongoose = require("mongoose")
const schema = mongoose.Schema

const userSchema = new schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type :String,
    required : true,
    lowercase: true,
    unique: true,
    trim: true
  },
  password:{
    type: String,
    required: true
  }
})

const userModel = mongoose.model("users",userSchema)

module.exports = userModel
