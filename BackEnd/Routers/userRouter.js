
const Router = require("express").Router()
const { Address, updateAddress } = require("../Controllors/AddressAPIs");
const ContactFormData = require("../Controllors/contact/ContactEmail");
const authCart = require("../Middlewares/authCart");
const loginLimiter = require("../Middlewares/apiLimiter/requestLimiter");
const { authenticateToken } = require("../Middlewares/verifiyToken");
const formSubmitLimiter = require("../Middlewares/apiLimiter/submitLimiter");
const newsletterSubscribe = require("../Controllors/contact/NewsLetterSubscriber");
const { getOrders, createOrder } = require("../Controllors/Cart/OrderAPI");
const { goToCart, addToCart, removeFromCart, deleteCart } = require("../Controllors/Cart/CartAPIs");
const requestLimiter = require("../Middlewares/apiLimiter/requestLimiter");


//Cart Related //
Router.get("/cart",authCart,goToCart)
Router.post("/cart/add",requestLimiter,authCart,addToCart);
Router.post("/cart/remove",requestLimiter,authCart,removeFromCart)
Router.post("/cart/delete",requestLimiter,authCart,deleteCart)

//Order Routes
Router.post("/orders", authenticateToken,getOrders)
Router.post("/orders/create",authenticateToken,createOrder)

// Contact Form
Router.post("/contact-form",formSubmitLimiter,ContactFormData)

// Subscriber
Router.post("/subscribe",formSubmitLimiter,newsletterSubscribe)

// User Address Related //
Router.get("/address", authenticateToken, Address)
Router.post("/address/update",formSubmitLimiter, authenticateToken,updateAddress)
module.exports = Router