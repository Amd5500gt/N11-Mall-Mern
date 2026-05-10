const crypto = require("crypto")
const nodemailer = require("nodemailer")
const userModel = require("../Models/userModel")

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
            from:process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset",
            html: ` 
  <div
    style="
      background:#f4f7fb;
      padding:40px 20px;
      font-family:Arial,sans-serif;
    "
  >

    <div
      style="
        max-width:500px;
        margin:auto;
        background:#ffffff;
        border-radius:20px;
        overflow:hidden;
        box-shadow:0 10px 30px rgba(0,0,0,0.08);
      "
    >

      <!-- HEADER -->
      <div
        style="
          background:linear-gradient(135deg,#6366f1,#8b5cf6);
          padding:30px;
          text-align:center;
        "
      >

        <h1
          style="
            color:white;
            margin:0;
            font-size:32px;
            font-weight:800;
            letter-spacing:1px;
          "
        >
          NexXcart
        </h1>

      </div>

      <!-- BODY -->
      <div
        style="
          padding:35px 30px;
          text-align:center;
        "
      >

        <h2
          style="
            margin:0 0 15px;
            color:#111827;
            font-size:24px;
          "
        >
          Password Reset OTP
        </h2>

        <p
          style="
            color:#6b7280;
            font-size:15px;
            line-height:1.6;
            margin-bottom:25px;
          "
        >
          Use the OTP below to reset your password.
          This OTP is valid for 5 minutes.
        </p>

        <!-- OTP BOX -->
        <div
          style="
            display:inline-block;
            background:#eef2ff;
            border:2px dashed #6366f1;
            padding:18px 40px;
            border-radius:16px;
            margin-bottom:25px;
          "
        >

          <h1
            style="
              margin:0;
              color:#6366f1;
              font-size:42px;
              letter-spacing:8px;
              font-weight:800;
            "
          >
            ${otp}
          </h1>

        </div>

        <p
          style="
            color:#9ca3af;
            font-size:13px;
            margin-top:10px;
          "
        >
          If you didn't request this password reset,
          you can safely ignore this email.
        </p>

      </div>

    </div>

  </div>

`
        })

        res.status(200).json({
            success: true,
            message: "OTP send successfully"
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
            return status(400).json({
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


const resetPassowrd = async (req, res) => {

    try {
        const { email, newPassword } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        user.password = newPassword

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

module.exports = { otpGenerate, verifyOTP, resetPassowrd }