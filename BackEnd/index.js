const express = require("express");
const app = express();

require("dotenv").config();

const cors = require("cors");

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 🔥 important
app.use(express.json());

const authRouter = require("./Routers/authRouter");
const productRouter = require("./Routers/productRouter");
const cartRouter = require("./Routers/cartRouter");
const addressRouter = require("./Routers/addressRouter");

// ✅ test route
app.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});

app.use("/", authRouter);
app.use("/", productRouter);
app.use("/cart", cartRouter);
app.use("/address", addressRouter);

module.exports = app;