const mongoose = require("mongoose")

const mongoURL = process.env.mongodb_URL

mongoose.connect(mongoURL)
.then(()=> console.log("Database Connected...."))
.catch((err)=> console.log("Connect failed.... ",err))
