const jwt = require("jsonwebtoken");
const demodata = require("../productData/demodata.json")
const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;

    try {
        if (!authHeader) {
              
            return res.status(403).json(demodata)

        
        }
        // ✅ correct split
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.jwt_secret);
        req.user = decoded;
        next();
    } catch (err) {
        if (!req.user) {
        res.json(demodata);
      }
        res.status(401).json({
            message: "Invalid or expired token"
        });
  }
};

module.exports = ensureAuthenticated;