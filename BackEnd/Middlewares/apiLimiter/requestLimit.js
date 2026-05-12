const rateLimit = require("express-rate-limit");

const reqestLimiter = rateLimit({

  windowMs: 3 * 1000,

  max: 1,

  standardHeaders: true,

  legacyHeaders: false,

  handler: (req, res) => {

    const retryAfter =
    Math.ceil(
      req.rateLimit.resetTime / 1000 -
      Date.now() / 1000
    );

    res.status(429).json({

      success: false,

      message:
      `Too many attempts. Try again in ${retryAfter} seconds`

    });

  }

});

module.exports = requestLimiter;