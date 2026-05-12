const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({

  windowMs: 60 * 1000, // 15 minutes

  max: 2,

  standardHeaders: true,

  legacyHeaders: false,

  handler: (req, res) => {

    const retryAfter = req.rateLimit?.resetTime
      ? Math.ceil(
          (req.rateLimit.resetTime.getTime() - Date.now()) / 1000
        )
      : 900;

    res.status(429).json({

      success: false,

      message:
        `🔒 Too many login/register attempts. Please try again in ${retryAfter} seconds.`

    });

  }

});

module.exports = authLimiter;