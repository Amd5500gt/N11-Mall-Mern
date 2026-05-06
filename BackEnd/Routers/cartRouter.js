
const Router = require("express").Router()
const { addToCart, goToCart, removeFromCart } = require("../Controllors/CartAPIs")
const authCart = require("../Middlewares/authCart")

Router.get("/",goToCart)
Router.post("/add",authCart,addToCart);
Router.post("/remove",authCart,removeFromCart)

module.exports = Router