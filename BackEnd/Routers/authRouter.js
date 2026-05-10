const Router = require("express").Router()

const { otpGenerate, verifyOTP, resetPassowrd, resetPassword } = require("../Controllors/ResetPassAPIs")
const { LoginUser, RegisterUser, GoogleUser } = require("../Controllors/userAPIs")
const { LoginUserValidation, RegisterUserValidation } = require("../Middlewares/authValidator")
const loginLimiter = require("../Middlewares/rateLimit")

// Testing
Router.get("/login",(req,res)=>{
        res.status(200).json({message:"Error Token not found!"})
})

// Login/Register
Router.post("/google",loginLimiter, GoogleUser)
Router.post("/login",loginLimiter,LoginUserValidation,LoginUser)
Router.post("/register",loginLimiter,RegisterUserValidation,RegisterUser)

// Password Reset

Router.post("/send-request",loginLimiter,otpGenerate)
Router.post("/verify-otp",loginLimiter, verifyOTP)
Router.post("/reset-password",loginLimiter, resetPassword)




module.exports = Router