const express = require("express");
const app = express();

require("dotenv").config();

const connectDB = require("./Models/db");

const cors = require("cors");

const authRouter = require("./Routers/authRouter");
const productRouter = require("./Routers/productRouter");
const cartRouter = require("./Routers/cartRouter");

app.use(express.json());

app.use(cors({
  origin: "*"
}));

app.use("/", authRouter);
app.use("/cart", cartRouter);
app.use("/", productRouter);

app.get("/", (req, res) => {
  res.json({
    message: "API running 🚀"
  });
});

module.exports = app;

const startServer = async () => {
  try {

    await connectDB();

    console.log("DB Connected");

    if (process.env.NODE_ENV !== "production") {

      const PORT = process.env.PORT || 8080;

      app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
      });

    }

  } catch (err) {

    console.log("Server Error:", err);

  }
};

startServer();