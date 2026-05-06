const Router = require("express").Router()
const {products, productPage} = require("../Controllors/productAPIs")
const ensureAuthenticated = require("../Middlewares/authData")


Router.get("/",ensureAuthenticated, products )
Router.get("/:id", productPage );

module.exports = Router