const serverless = require("serverless-http");
const app = require("../index");

module.exports = async (req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // 🔥 preflight request fix
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  return serverless(app)(req, res);
};