const express = require("express")
const {LoginUser} = require("../APIs-controller/Users")
const router = express.Router()

const { loginUserValidation } = require("../userValidator/Validator");
router.post("/",loginUserValidation, LoginUser)

module.exports = router