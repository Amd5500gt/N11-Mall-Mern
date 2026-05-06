const mongoose = require("mongoose")

const mongoURL = process.env.mongodb_url

mongoose.connect(mongoURL)
.then(()=> console.log("Database Connected...."))
.catch((err)=> console.log("Connect failed.... ",err))
