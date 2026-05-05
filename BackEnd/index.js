const express = require("express");
const app = express();
require("dotenv").config();
require("../Models/db");

const cors = require("cors");
const bodyparser = require("body-parser");

const authRouter = require("../Routers/authRouter");
const productRouter = require("../Routers/productRouter");
const cartRouter = require("../Routers/cartRouter");
const addressRouter = require("../Routers/addressRouter");

app.use(bodyparser.json());
app.use(cors());
app.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});
app.use("/", authRouter);
app.use("/", productRouter);
app.use("/cart", cartRouter);
app.use("/address", addressRouter);

// ❌ NO app.listen
module.exports = app;