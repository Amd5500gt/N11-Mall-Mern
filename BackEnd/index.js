const express = require("express");
const app = express();
require("dotenv").config();

const cors = require("cors");
const bodyparser = require("body-parser");

const authRouter = require("./Routers/authRouter");
const productRouter = require("./Routers/productRouter");
const cartRouter = require("./Routers/cartRouter");
const addressRouter = require("./Routers/addressRouter");

app.use(bodyparser.json());
const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-frontend.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});
app.use("/", authRouter);
app.use("/", productRouter);
app.use("/cart", cartRouter);
app.use("/address", addressRouter);

// ❌ NO app.listen
module.exports = app;