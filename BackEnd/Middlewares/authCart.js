const jwt = require("jsonwebtoken");

const authCart = (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    // CHECK HEADER
    if (!authHeader || !authHeader.startsWith("Bearer ")) {

      return res.status(401).json({
        success: false,
        message: "No Authorization header"
      });

    }

    const token = authHeader.split(" ")[1];

    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.jwt_secret
    );

    req.user = decoded;

    next();

  } catch (err) {

    console.log("JWT ERROR:", err.message);

    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });

  }

};

module.exports = authCart;