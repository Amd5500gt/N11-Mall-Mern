const express = require("express");
const serverless = require("serverless-http");
const app = express();
require("dotenv").config();
const connectDB = require("../Models/db");
const cors = require("cors");
const bodyparser = require("body-parser");
const authRouter = require("../Routers/authRouter");
const productRouter = require("../Routers/productRouter");
const cartRouter = require("../Routers/cartRouter");

// Connect to MongoDB
connectDB();

app.use(bodyparser.json());
app.use(cors());

app.use("/", authRouter);
app.use("/cart", cartRouter);
app.use("/", productRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// For Vercel serverless
module.exports.handler = serverless(app);

// For local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`);
  });
}