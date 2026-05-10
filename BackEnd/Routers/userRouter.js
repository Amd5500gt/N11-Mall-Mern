
const Router = require("express").Router()
const { Address, updateAddress } = require("../Controllors/AddressAPIs");
const { addToCart, goToCart, removeFromCart, deleteCart } = require("../Controllors/CartAPIs")
const authCart = require("../Middlewares/authCart");
const loginLimiter = require("../Middlewares/rateLimit");
const { authenticateToken } = require("../Middlewares/verifiyToken");

//Cart Related //
Router.get("/cart",loginLimiter, authCart,goToCart)
Router.post("/cart/add",loginLimiter,authCart,addToCart);
Router.post("/cart/remove",loginLimiter,authCart,removeFromCart)
Router.post("/cart/delete",loginLimiter,authCart,deleteCart)

// User Address Related //
Router.get("/address",loginLimiter, authenticateToken, Address)
Router.post("/address/update",loginLimiter, authenticateToken,updateAddress)
module.exports = Router