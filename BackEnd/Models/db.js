const mongoose = require("mongoose");

const mongoURL = process.env.mongodb_URL;

// Global variable to cache the connection (important for serverless)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Add these options for better serverless performance
      maxPoolSize: 1,
      socketTimeoutMS: 30000,
      family: 4
    };

    cached.promise = mongoose.connect(mongoURL, opts).then((mongoose) => {
      console.log("Database Connected....");
      return mongoose;
    }).catch((err) => {
      console.log("Connect failed.... ", err);
      throw err;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;