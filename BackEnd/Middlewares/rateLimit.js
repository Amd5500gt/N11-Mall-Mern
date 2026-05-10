const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({

  windowMs: 60 * 1000,

  max: 4,

  message: {
    success: false,
    message: "Too many attempts, please try again after 1 minute"
  },

  standardHeaders: true,

  legacyHeaders: false

});

module.exports = loginLimiter;