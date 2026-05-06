const Router = require("express").Router()
const {products, productPage} = require("../Controllors/productAPIs")
const demodata = require("../productData/demodata.json")
const ensureAuthenticated = require("../Middlewares/authData")


Router.get("/demo", (req, res) => {
  res.json(demodata);
 });
Router.get("/",ensureAuthenticated, products )
Router.get("/:id", productPage );

module.exports = Router