const nodemailer = require("nodemailer")
const userModel = require("../../Models/userModel")
const bcrypt = require("bcrypt")
const otpGenerate = async (req, res) => {

    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // generate OTP

        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        user.passwordResetOTP = otp;

        user.passwordResetOTPExpire = Date.now() + 5 * 60 * 1000;
        await user.save()


        //mail transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

      await transporter.sendMail({

  from: process.env.EMAIL_USER,

  to: email,

  subject: `Your NexXcart OTP is ${otp}`,

  text:
  `Your NexXcart OTP is ${otp}.
   This OTP is valid for 5 minutes.`,

  html: `

<div
  style="
    background:#f6fff9;
    padding:30px 15px;
    font-family:
    Inter,
    Arial,
    sans-serif;
  "
>

  <!-- PREVIEW TEXT -->

  <div
    style="
      display:none;
      max-height:0;
      overflow:hidden;
    "
  >

    Your NexXcart OTP is ${otp}

  </div>

  <!-- CARD -->

  <div
    style="
      max-width:460px;
      margin:auto;
      background:#ffffff;

      border-radius:18px;

      overflow:hidden;

      border:1px solid #dcfce7;

      box-shadow:
      0 4px 18px
      rgba(34,197,94,0.08);
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

          letter-spacing:0.5px;
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
        This code will expire in 5 minutes.

      </p>

      <!-- OTP BOX -->

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
})

        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }


};


const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        // check otp
        if (user.passwordResetOTP !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid Otp"
            })
        }

        // check expire

        if (user.passwordResetOTPExpire < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired"
            })
        }
        res.status(200).json({
            success: true,
            message: "OTP verified"
        })

    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message

        })
    }
}


const resetPassword = async (req, res) => {

    try {
        const { email, newPassword } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
       const hashedPassword =
await bcrypt.hash(newPassword, 10)

user.password = hashedPassword

        //clear otp
        user.passwordResetOTP = null;
        user.passwordResetOTPExpire = null;

        await user.save()

        res.status(200).json({
            success: true,
            message: "Password Reset successfully"
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

module.exports = { otpGenerate, verifyOTP, resetPassword }