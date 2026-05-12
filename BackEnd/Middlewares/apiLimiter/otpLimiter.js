const rateLimit = require("express-rate-limit");

const otpLimiter = rateLimit({

  windowMs: 60 * 1000,

  max: 1,

  standardHeaders: true,

  legacyHeaders: false,

  handler: (req, res) => {

    const retryAfter =
    Math.ceil(
      req.rateLimit?.resetTime / 1000 -
      Date.now() / 1000
    );

    res.status(429).json({

      success: false,

   message:
`⏳ Please wait ${retryAfter}s before requesting another OTP.`

    });

  }

});

module.exports = otpLimiter;