require("dotenv").config();
const express = require("express");
const app = express();
const compression = require("compression")

const helmet = require("helmet")

const connectDB = require("./Models/db");

const cors = require("cors");

const authRouter = require("./Routers/authRouter");
const productRouter = require("./Routers/productRouter");
const userRouter = require("./Routers/userRouter");

connectDB();
app.set("trust proxy", 1);
app.use(compression())
app.use(express.json());
app.use(helmet())
app.use(express.static(path.join(__dirname, "public")));
// Allowed Frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "https://nexxcartvx.vercel.app"
];

// CORS Setup
app.use(
  cors({
    origin: function (origin, callback) {

      // Allow Postman / mobile apps / server-to-server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],

    credentials: true
  })
);

// Routes
app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/user", userRouter);

// Test Route
app.get("/", (req, res) => {
  console.log("Root endpoint accessed");

  res.status(200).json({
    success: true,
    message: "Hey Welcome To N11"
  });
});

// Localhost Server Run
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// Export for Vercel
module.exports = app;