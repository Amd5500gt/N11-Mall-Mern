const jwt = require("jsonwebtoken");

const authCart = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ✅ Check header
    if (!authHeader) {
      return res.status(401).json({ message: "No Authorization header" });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Check token
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.jwt_secret);

    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authCart;