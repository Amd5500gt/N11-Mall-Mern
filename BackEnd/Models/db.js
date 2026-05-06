const mongoose = require("mongoose");

const mongoURL = process.env.mongodb_url;

if (!mongoURL) {
  console.error("FATAL ERROR: mongodb_URL is not defined in environment variables");
  process.exit(1);
}

// Cache connection for serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log("Using cached database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 1,
      minPoolSize: 1
    };

    console.log("Creating new database connection...");
    cached.promise = mongoose.connect(mongoURL, opts)
      .then((mongoose) => {
        console.log("Database Connected Successfully");
        return mongoose;
      })
      .catch((err) => {
        console.error("Database connection failed:", err.message);
        cached.promise = null;
        throw err;
      });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  
  return cached.conn;
}

module.exports = connectDB;