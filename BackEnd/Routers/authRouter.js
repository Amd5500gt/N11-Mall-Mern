const { LoginUser, RegisterUser } = require("../Controllors/userAPIs")
const { LoginUserValidation, RegisterUserValidation } = require("../Middlewares/authValidator")

const Router = require("express").Router()

Router.post("/login",LoginUserValidation,LoginUser)
Router.post("/register",RegisterUserValidation,RegisterUser)


module.exports = Router