const Router = require("express").Router()
const {products, productPage} = require("../Controllors/productAPIs")
const ensureAuthenticated = require("../Middlewares/authData")


Router.get("/products",ensureAuthenticated, products )
Router.get("/products/:id", productPage );

module.exports = Router