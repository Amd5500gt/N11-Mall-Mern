
const Router = require("express").Router()
const { Address, updateAddress } = require("../Controllors/AddressAPIs");
const { addToCart, goToCart, removeFromCart, deleteCart } = require("../Controllors/CartAPIs");
const ContactFormData = require("../Controllors/contact/ContactEmail");
const authCart = require("../Middlewares/authCart");
const loginLimiter = require("../Middlewares/apiLimiter/requestLimiter");
const { authenticateToken } = require("../Middlewares/verifiyToken");
const formSubmitLimiter = require("../Middlewares/apiLimiter/submitLimiter");
const newsletterSubscribe = require("../Controllors/contact/NewsLetterSubscriber");

//Cart Related //
Router.get("/cart",loginLimiter, authCart,goToCart)
Router.post("/cart/add",loginLimiter,authCart,addToCart);
Router.post("/cart/remove",loginLimiter,authCart,removeFromCart)
Router.post("/cart/delete",loginLimiter,authCart,deleteCart)

// Contact Form
Router.post("/contact-form",formSubmitLimiter,ContactFormData)

// Subscriber
Router.post("/subscribe",formSubmitLimiter,newsletterSubscribe)

// User Address Related //
Router.get("/address", authenticateToken, Address)
Router.post("/address/update",formSubmitLimiter, authenticateToken,updateAddress)
module.exports = Router