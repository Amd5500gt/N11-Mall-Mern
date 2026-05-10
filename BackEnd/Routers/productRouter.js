const Router = require("express").Router()
const {products, productPage} = require("../Controllors/productAPIs")
const demodata = require("../productData/demodata.json")
const ensureAuthenticated = require("../Middlewares/authData");
const loginLimiter = require("../Middlewares/rateLimit");


Router.get("/demo",loginLimiter, (req, res) => {
  res.json(demodata);
 });
Router.get("/",loginLimiter,ensureAuthenticated, products )
Router.get("/:id",loginLimiter, ensureAuthenticated, productPage );

module.exports = Router