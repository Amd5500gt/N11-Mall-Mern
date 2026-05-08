
const Router = require("express").Router()
const { addToCart, goToCart, removeFromCart } = require("../Controllors/CartAPIs")
const authCart = require("../Middlewares/authCart")

Router.get("/details", authCart,goToCart)
Router.post("/add",authCart,addToCart);
Router.post("/remove",authCart,removeFromCart)

module.exports = Router