const Router = require("express").Router()

const productsAPIs = require("../Controllors/productAPIs")
const ensureAuthenticated = require("../Middlewares/authData")

Router.get("/products",ensureAuthenticated, productsAPIs )


module.exports = Router