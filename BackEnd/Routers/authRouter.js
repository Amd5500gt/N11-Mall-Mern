const Router = require("express").Router()

const { LoginUser, RegisterUser, GoogleUser } = require("../Controllors/userAPIs")
const { LoginUserValidation, RegisterUserValidation } = require("../Middlewares/authValidator")


Router.get("/login",(req,res)=>{
        res.status(200).json({message:"Login API is working"})
})

Router.post("/google-login",GoogleUser)
Router.post("/login",LoginUserValidation,LoginUser)
Router.post("/register",RegisterUserValidation,RegisterUser)


module.exports = Router