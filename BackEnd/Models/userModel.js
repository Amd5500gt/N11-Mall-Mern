const mongoose = require("mongoose");

const connectDB = async () => {
  try {

    // Prevent multiple connections
    if (mongoose.connections[0].readyState) {
      console.log("Already connected");
      return;
    }

    await mongoose.connect(process.env.mongodb_url);

    console.log("MongoDB Connected");

  } catch (err) {
    console.log("MongoDB Error:", err);
  }
};

module.exports = connectDB;