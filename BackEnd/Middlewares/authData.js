const jwt = require("jsonwebtoken");

const demodata = require("../productData/demodata.json");

const ensureAuthenticated = (req, res, next) => {

  const authHeader = req.headers.authorization;

  try {

    // NO TOKEN
    if (!authHeader) {

      return res.status(200).json(demodata);

    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.jwt_secret
    );

    req.user = decoded;

    next();

  } catch (err) {

    console.log(err);

    return res.status(200).json(demodata);

  }

};

module.exports = ensureAuthenticated;