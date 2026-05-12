const nodemailer = require("nodemailer");
const userModel = require("../../Models/userModel");
const bcrypt = require("bcrypt");

/* ================= GENERATE OTP ================= */

const otpGenerate = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {

      return res.status(404).json({

        success: false,
        message: "User not found"

      });

    }

    /* ================= GENERATE OTP ================= */

    const otp =
      Math.floor(
        1000 + Math.random() * 9000
      ).toString();

    user.passwordResetOTP = otp;

    user.passwordResetOTPExpire =
      new Date(
        Date.now() + 60 * 1000
      );

    user.isOTPVerified = false;

    await user.save();

    /* ================= MAIL TRANSPORTER ================= */

    const transporter =
      nodemailer.createTransport({

        service: "gmail",

        auth: {

          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS

        }

      });

    /* ================= SEND EMAIL ================= */

    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: email,

      subject: `Your NexXcart OTP is ${otp}`,

      text: `
Your NexXcart OTP is ${otp}.

This OTP is valid for 1 minute.
`,

      html: `

<div
  style="
    background:#f6fff9;
    padding:30px 15px;
    font-family:Inter,Arial,sans-serif;
  "
>

  <div
    style="
      max-width:460px;
      margin:auto;
      background:#ffffff;
      border-radius:18px;
      overflow:hidden;
      border:1px solid #dcfce7;
      box-shadow:0 4px 18px rgba(34,197,94,0.08);
    "
  >

    <!-- HEADER -->

    <div
      style="
        background:
        linear-gradient(
          135deg,
          #22c55e,
          #4ade80
        );
        padding:22px;
        text-align:center;
      "
    >

      <h1
        style="
          color:white;
          margin:0;
          font-size:24px;
          font-weight:700;
        "
      >
        NexXcart
      </h1>

    </div>

    <!-- BODY -->

    <div
      style="
        padding:30px 22px;
        text-align:center;
      "
    >

      <h2
        style="
          margin:0 0 10px;
          color:#14532d;
          font-size:20px;
          font-weight:700;
        "
      >
        Password Reset
      </h2>

      <p
        style="
          color:#4b5563;
          font-size:13px;
          line-height:1.7;
          margin-bottom:22px;
        "
      >

        Use this OTP to reset your password.
        This code will expire in 1 minute.

      </p>

      <!-- OTP -->

      <div
        style="
          display:inline-block;
          background:#f0fdf4;
          border:1.5px dashed #22c55e;
          padding:14px 30px;
          border-radius:14px;
          margin-bottom:20px;
        "
      >

        <h1
          style="
            margin:0;
            color:#16a34a;
            font-size:34px;
            letter-spacing:6px;
            font-weight:800;
          "
        >

          ${otp}

        </h1>

      </div>

      <p
        style="
          color:#9ca3af;
          font-size:11px;
          line-height:1.6;
          margin-top:10px;
        "
      >

        If you didn’t request a password reset,
        you can safely ignore this email.

      </p>

    </div>

  </div>

</div>

`
    });

    /* ================= RESPONSE ================= */

    res.status(200).json({

      success: true,
      message: "OTP sent successfully"

    });

  }

  catch (err) {

    res.status(500).json({

      success: false,
      message: err.message

    });

  }

};

const verifyOTP = async (req, res) => {

  try {

    const { email, otp } = req.body;

    const user =
      await userModel.findOne({ email });

    if (!user) {

      return res.status(404).json({

        success: false,
        message: "User not found"

      });

    }

    /* ================= OTP ATTEMPT LIMIT ================= */

    if (user.otpAttempts >= 5) {

      return res.status(429).json({

        success: false,

        message:
          "Too many wrong OTP attempts. Please request a new OTP."

      });

    }

    /* ================= CHECK OTP ================= */

    if (user.passwordResetOTP !== otp) {

      user.otpAttempts += 1;

      await user.save();

      return res.status(400).json({

        success: false,

        message:
          `Invalid OTP. Attempts left: ${5 - user.otpAttempts}`

      });

    }

    /* ================= CHECK EXPIRE ================= */

    if (
      user.passwordResetOTPExpire <
      Date.now()
    ) {

      return res.status(400).json({

        success: false,
        message: "OTP expired"

      });

    }

    /* ================= SUCCESS ================= */

    user.isOTPVerified = true;

    user.otpAttempts = 0;

    await user.save();

    res.status(200).json({

      success: true,
      message: "OTP verified successfully"

    });

  }

  catch (err) {

    res.status(500).json({

      success: false,
      message: err.message

    });

  }

};
/* ================= RESET PASSWORD ================= */

const resetPassword = async (req, res) => {

  try {

    const {
      email,
      newPassword
    } = req.body;

    const user =
      await userModel.findOne({ email });

    if (!user) {

      return res.status(404).json({

        success: false,
        message: "User not found"

      });

    }

    /* ================= CHECK VERIFIED ================= */

    if (!user.isOTPVerified) {

      return res.status(400).json({

        success: false,
        message: "Verify OTP first"

      });

    }

    /* ================= PASSWORD VALIDATION ================= */

    if (newPassword.length < 6) {

      return res.status(400).json({

        success: false,

        message:
          "Password must be at least 8 characters"

      });
    /* ================= STRONG PASSWORD ================= */

    const strongPassword =
      /^(?=.*[A-Z])(?=.*[0-9]).{6,}$/;

    if (!strongPassword.test(newPassword)) {

      return res.status(400).json({

        success: false,

        message:
          "Password must contain uppercase letter and number"

      });

    }

    }
    /* ================= PREVENT SAME PASSWORD ================= */

    const isSamePassword =
      await bcrypt.compare(
        newPassword,
        user.password
      );

    if (isSamePassword) {

      return res.status(400).json({

        success: false,

        message:
          "New password cannot be same as old password"

      });

    }

    /* ================= HASH PASSWORD ================= */

    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    /* ================= CLEAR OTP ================= */

    user.passwordResetOTP = null;

    user.passwordResetOTPExpire = null;

    user.isOTPVerified = false;

    await user.save();

    /* ================= RESPONSE ================= */

    res.status(200).json({

      success: true,
      message: "Password reset successfully"

    });

  }

  catch (err) {

    res.status(500).json({

      success: false,
      message: err.message

    });

  }

};

module.exports = {

  otpGenerate,
  verifyOTP,
  resetPassword

};