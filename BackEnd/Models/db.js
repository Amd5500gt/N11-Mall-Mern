const mongoose = require("mongoose");

const mongoURL = process.env.MONGODB_URL;

async function connectDB() {
  try {

    if (!mongoURL) {
      throw new Error("MONGODB_URL missing in .env");
    }

    if (mongoose.connection.readyState === 1) {
      console.log("Already Connected");
      return;
    }

    await mongoose.connect(mongoURL, {
      serverSelectionTimeoutMS: 30000
    });

    console.log("MongoDB Connected");

  } catch (err) {

    console.log("Connect failed:", err);

    process.exit(1);
  }
}

module.exports = connectDB;