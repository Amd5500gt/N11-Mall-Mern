
const mongoose = require("mongoose")
const userModel = require("../models/userModel");
const { validationResult } = require("express-validator")
const bcrypt = require("bcrypt")
const jwt =  require("jsonwebtoken")

mongoose.connect("mongodb://127.0.0.1:27017/n11UserData")
    .then(() => console.log("db connection success"))
    .catch(err => console.log(err))

cf
  const RegisterUser = async(req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return  res.status(400).json({
               message : "Validation Error",
                errors: errors.array()
            })
        }
        
        const { name, email, number, password } = req.body;
        const existUser = await userModel.findOne({ email });

        if (existUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }
        const hashpassword = await bcrypt.hashSync(password, 10)
        const user = await userModel.create({
            name,
            email,
            number,
            password : hashpassword
        });
        console.log(user);
           
           res.status(201).json({
            message: "User Registered Successfully"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error! Try again"
        });
    }
}



const LoginUser = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation Error",
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User doesn't exist"
      });
    }
    const isMatchPassword = await bcrypt.compareSync(password, user.password)
    if (!isMatchPassword) {
      return res.status(400).json({
        message: "Wrong password!"
      });
    }

    return res.status(200).json({
      message: "Login-Success"
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server Error"
    });
  }
};
module.exports = {RegisterUser,LoginUser}