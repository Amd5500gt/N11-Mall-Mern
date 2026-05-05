const express = require("express")
const app = express()
require("dotenv").config()
require ("./Models/db")
const cors = require("cors")
const bodyparser = require("body-parser")
const PORT = process.env.PORT || 8080;
const authRouter = require("./Routers/authRouter")
const productRouter = require("./Routers/productRouter")
app.use(bodyparser.json())
app.use(cors())

app.use("/", authRouter)

app.use("/", productRouter)

app.listen(PORT, ()=>{
    console.log(`Server is Running on  ${PORT}`)
})