const nodemailer = require("nodemailer")
const userModel = require("../../Models/userModel")
const ContactFormData = async (req, res) => {

    try {
        const { name, email, phone, message } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "Login First",
                success: false
            });
        }

        const contactData = {
            name,
            email,
            phone,
            message
        }
        user.contact = contactData
        await user.save()
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
          res.status(200).json({
            success: true,
            message: "Thanks for reaching out 💚 We’ve received your message and will respond soon."
        });

        setTimeout( async() => {
            await transporter.sendMail({

                from: process.env.EMAIL_USER,

                to: email,

                subject: "We Received Your Message • NexXcart",

                text: `
Hello ${name},

Thank you for contacting NexXcart.

We have successfully received your message and our team will get back to you soon.

Your Message:
"${message}"

Thank you,
NexXcart Support Team
`,

                html: `

<div
  style="
    background:#f6fff9;
    padding:30px 15px;
    font-family:Inter,Arial,sans-serif;
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
    We received your message successfully.
  </div>

  <!-- CARD -->

  <div
    style="
      max-width:500px;
      margin:auto;
      background:#ffffff;
      border-radius:20px;
      overflow:hidden;
      border:1px solid #dcfce7;
      box-shadow:0 8px 30px rgba(34,197,94,0.08);
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
        padding:28px;
        text-align:center;
      "
    >

      <h1
        style="
          color:white;
          margin:0;
          font-size:28px;
          font-weight:800;
          letter-spacing:0.5px;
        "
      >
        NexXcart
      </h1>

      <p
        style="
          color:rgba(255,255,255,0.9);
          margin-top:8px;
          font-size:13px;
        "
      >
        Support Confirmation
      </p>

    </div>

    <!-- BODY -->

    <div
      style="
        padding:32px 24px;
      "
    >

      <h2
        style="
          margin-top:0;
          margin-bottom:12px;
          color:#14532d;
          font-size:22px;
          font-weight:700;
          text-align:center;
        "
      >
        Message Received ✅
      </h2>

      <p
        style="
          color:#4b5563;
          font-size:14px;
          line-height:1.8;
          text-align:center;
          margin-bottom:25px;
        "
      >
        Hi <strong>${name}</strong>,
        <br/><br/>
        Thank you for contacting NexXcart.
        Our support team has successfully received your message
        and we’ll respond as soon as possible.
      </p>

      <!-- MESSAGE BOX -->

      <div
        style="
          background:#f0fdf4;
          border:1px solid #bbf7d0;
          border-radius:16px;
          padding:18px;
          margin-bottom:24px;
        "
      >

        <p
          style="
            margin:0 0 10px;
            color:#166534;
            font-size:13px;
            font-weight:700;
          "
        >
          YOUR MESSAGE
        </p>

        <p
          style="
            margin:0;
            color:#374151;
            font-size:14px;
            line-height:1.7;
          "
        >
          ${message}
        </p>

      </div>

      <!-- INFO -->

      <div
        style="
          text-align:center;
        "
      >

        <p
          style="
            color:#6b7280;
            font-size:13px;
            line-height:1.7;
            margin-bottom:0;
          "
        >
          Our team usually replies within
          <strong>24 hours</strong>.
        </p>

      </div>

    </div>

    <!-- FOOTER -->

    <div
      style="
        border-top:1px solid #ecfdf5;
        padding:18px;
        text-align:center;
        background:#fafafa;
      "
    >

      <p
        style="
          margin:0;
          color:#9ca3af;
          font-size:12px;
          line-height:1.6;
        "
      >
        © ${new Date().getFullYear()} NexXcart.
        All rights reserved.
      </p>

    </div>

  </div>

</div>

`    })
        }, 3000);

   
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }


};

module.exports = ContactFormData