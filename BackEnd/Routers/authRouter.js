const Router = require("express").Router()

const { otpGenerate, verifyOTP, resetPassowrd, resetPassword } = require("../Controllors/ResetPassAPIs")
const { LoginUser, RegisterUser, GoogleUser } = require("../Controllors/userAPIs")
const { LoginUserValidation, RegisterUserValidation } = require("../Middlewares/authValidator")

// Testing
Router.get("/login",(req,res)=>{
        res.status(200).json({message:"Error Token not found!"})
})

// Login/Register
Router.post("/google",GoogleUser)
Router.post("/login",LoginUserValidation,LoginUser)
Router.post("/register",RegisterUserValidation,RegisterUser)

// Password Reset

Router.post("/send-request",otpGenerate)
Router.post("/verify-otp", verifyOTP)
Router.post("/reset-password", resetPassword)




module.exports = Router