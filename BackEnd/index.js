const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./Models/db"); // Import the connection function
const cors = require("cors");
const bodyparser = require("body-parser");
const PORT = process.env.PORT || 8080;
const authRouter = require("./Routers/authRouter");
const productRouter = require("./Routers/productRouter");
const cartRouter = require("./Routers/cartRouter");

// Connect to MongoDB before handling requests
connectDB();

app.use(bodyparser.json());
app.use(cors());

app.use("/", authRouter);
app.use("/cart", cartRouter);
app.use("/", productRouter);

// For Vercel
module.exports = app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`);
  });
}