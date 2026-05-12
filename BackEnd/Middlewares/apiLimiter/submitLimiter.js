const rateLimit = require("express-rate-limit");

const formSubmitLimiter = rateLimit({

  windowMs: 5 * 60 * 1000, //

  max: 1,

  standardHeaders: true,

  legacyHeaders: false,

  handler: (req, res) => {

    const retryAfter = req.rateLimit?.resetTime
      ? Math.ceil(
          (req.rateLimit.resetTime.getTime() - Date.now()) / 1000
        )
      : 60;

    res.status(429).json({

      success: false,

      message:
        `📩 Too many form submissions. Please wait ${retryAfter} seconds before submitting again.`

    });

  }

});

module.exports = formSubmitLimiter;