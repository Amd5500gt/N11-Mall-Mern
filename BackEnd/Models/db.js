const mongoose = require("mongoose");

const mongoURL = process.env.MONGODB_URL;

async function connectDB() {
  try {

    if (mongoose.connection.readyState === 1) {
      console.log("Already Connected");
      return;
    }

    await mongoose.connect(mongoURL);

    console.log("MongoDB Connected");

  } catch (err) {

    console.log("Connect failed:", err);

  }
}

module.exports = connectDB;