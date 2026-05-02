const express = require("express")
const {RegisterUser} = require("../APIs-controller/Users.js")
const router = express.Router()
const {newUserValidation} = require("../userValidator/Validator")

router.post("/",newUserValidation,RegisterUser)

module.exports = router