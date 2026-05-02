const express = require("express");
const app = express();
const cors = require("cors");

const productRouter = require("./Router/getProducts");
const newUserRouter = require("./Router/Register");
const userLoginRouter = require("./Router/Login");

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/products", productRouter);
app.use("/register", newUserRouter);
app.use("/login", userLoginRouter);

app.listen(3000, () => console.log("Server is Running"));