const nodemailer = require("nodemailer");

const newsletterSubscribe = async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    /* ================= MAIL TRANSPORTER ================= */

    const transporter = nodemailer.createTransport({

      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }

    });

    /* ================= RESPONSE ================= */

    res.status(200).json({

      success: true,

      message:
        "🎉 Successfully subscribed to NexXcart newsletter."

    });

    /* ================= SEND EMAIL ================= */

    setTimeout(async () => {

      await transporter.sendMail({

        from: `"NexXcart" ${process.env.EMAIL_USER}`,

        to: email,

        subject: "Welcome to NexXcart Newsletter 💚",

        text: `
Thank you for subscribing to NexXcart.

You’ll now receive:
- Latest offers
- New arrivals
- Exclusive discounts
- Updates from NexXcart

Stay tuned 💚
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
        padding:30px;
        text-align:center;
      "
    >

      <h1
        style="
          color:white;
          margin:0;
          font-size:30px;
          font-weight:800;
        "
      >
        NexXcart
      </h1>

      <p
        style="
          color:rgba(255,255,255,0.9);
          margin-top:10px;
          font-size:14px;
        "
      >
        Newsletter Subscription
      </p>

    </div>

    <!-- BODY -->

    <div
      style="
        padding:35px 24px;
        text-align:center;
      "
    >

      <h2
        style="
          color:#14532d;
          margin-top:0;
          font-size:24px;
        "
      >
        Welcome 💚
      </h2>

      <p
        style="
          color:#4b5563;
          font-size:14px;
          line-height:1.8;
        "
      >
        Thank you for subscribing to
        <strong>NexXcart Newsletter</strong>.
      </p>

      <!-- FEATURES -->

      <div
        style="
          background:#f0fdf4;
          border:1px solid #bbf7d0;
          border-radius:16px;
          padding:18px;
          margin-top:25px;
          text-align:left;
        "
      >

        <p style="margin:8px 0;">✨ Latest product launches</p>

        <p style="margin:8px 0;">🔥 Exclusive discounts & offers</p>

        <p style="margin:8px 0;">🚚 Special shopping updates</p>

        <p style="margin:8px 0;">💎 Premium member deals</p>

      </div>

      <p
        style="
          color:#6b7280;
          font-size:13px;
          margin-top:25px;
          line-height:1.7;
        "
      >
        Stay connected with NexXcart 💚
      </p>

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
        "
      >
        © ${new Date().getFullYear()} NexXcart.
        All rights reserved.
      </p>

    </div>

  </div>

</div>

`

      });

    }, 2000);

  }

  catch (err) {

    res.status(500).json({

      success: false,
      message: err.message

    });

  }

};

module.exports = newsletterSubscribe;