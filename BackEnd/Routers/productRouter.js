const Router = require("express").Router()
const {products, productPage} = require("../Controllors/productAPIs")
const products = require("../productData/demodata.json")
const ensureAuthenticated = require("../Middlewares/authData")


Router.get("/",ensureAuthenticated, products )
Router.get("/demo", (req, res) => {
  res.json(demodata);
 });
Router.get("/:id", productPage );

module.exports = Router