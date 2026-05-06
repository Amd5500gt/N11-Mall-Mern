const express = require("express");
const app = express();

require("dotenv").config();

const connectDB = require("./Models/db");

const cors = require("cors");

const authRouter = require("./Routers/authRouter");
const productRouter = require("./Routers/productRouter");
const cartRouter = require("./Routers/cartRouter");

connectDB();

app.use(express.json());

app.use(cors({
  origin: [
    "https://nexxcart.pages.dev/"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);

app.get("/", (req, res) => {

  console.log("Root endpoint accessed");

  return res.json({
    message: "Hey Welcome To N11"
  });

});

module.exports = app;