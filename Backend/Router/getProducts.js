const express = require("express")
const productData = require("../APIs-controller/Products")
const productRouter = express.Router()

productRouter.get("/",productData)

module.exports = productRouter