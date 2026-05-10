
const Router = require("express").Router()
const { Address, updateAddress } = require("../Controllors/AddressAPIs");
const { addToCart, goToCart, removeFromCart, deleteCart } = require("../Controllors/CartAPIs")
const authCart = require("../Middlewares/authCart");
const { authenticateToken } = require("../Middlewares/verifiyToken");

//Cart Related //
Router.get("/cart", authCart,goToCart)
Router.post("/cart/add",authCart,addToCart);
Router.post("/cart/remove",authCart,removeFromCart)
Router.post("/cart/delete",authCart,deleteCart)

// User Address Related //
Router.get("/address", authenticateToken, Address)
Router.post("/address/update", authenticateToken,updateAddress)
module.exports = Router