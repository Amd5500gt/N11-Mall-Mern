const jwt = require("jsonwebtoken");

const demodata = require("../productData/demodata.json");

const ensureAuthenticated = (req, res, next) => {

  const authHeader = req.headers.authorization;

  try {

    // NO TOKEN
    if (!authHeader) {

      return res.status(403).json({
        success: false,
        message: "No token provided"
      });

    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (err) {

    console.log(err);

    return res.status(403).json({
      success: false,
      message: "Invalid token"
    });

  }

};

module.exports = ensureAuthenticated;