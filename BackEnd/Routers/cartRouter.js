
const Router = require("express").Router()
const { addToCart, goToCart, removeFromCart } = require("../Controllors/CartAPIs")
const authCart = require("../Middlewares/authCart")

Router.post("/add",authCart,addToCart);
Router.get("/",goToCart)
Router.post("/remove",authCart,removeFromCart)

module.exports = Router