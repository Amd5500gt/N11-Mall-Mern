const Router = require("express").Router()

const { otpGenerate, verifyOTP, resetPassowrd, resetPassword } = require("../Controllors/auth/ResetPassAPIs")
const { LoginUser, RegisterUser, GoogleUser } = require("../Controllors/auth/userAPIs")
const { LoginUserValidation, RegisterUserValidation } = require("../Middlewares/authValidator")
const otpLimiter = require("../Middlewares/apiLimiter/otpLimiter")
const loginLimiter = require("../Middlewares/apiLimiter/requestLimit")
const authLimiter = require("../Middlewares/apiLimiter/authLimter")

// Testing
Router.get("/login",(req,res)=>{
        res.status(200).json({message:"Error Token not found!"})
})

// Login/Register
Router.post("/google",authLimiter, GoogleUser)
Router.post("/login",authLimiter,LoginUserValidation,LoginUser)
Router.post("/register",authLimiter,RegisterUserValidation,RegisterUser)

// Password Reset

Router.post("/send-request",otpLimiter,otpGenerate)
Router.post("/verify-otp",otpLimiter, verifyOTP)
Router.post("/reset-password",otpLimiter, resetPassword)




module.exports = Router