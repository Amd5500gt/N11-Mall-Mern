const orderModel = require("../../Models/orderModel");
const userModel = require("../../Models/userModel");
const nodemailer = require("nodemailer");

/* =========================
   MAIL TRANSPORTER
========================= */

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify transporter on startup
transporter.verify((error, success) => {
    if (error) {
        console.log("Email transporter error:", error);
    } else {
        console.log("Email transporter ready");
    }
});

/* =========================
   CREATE ORDER
========================= */

const createOrder = async (req, res) => {
    try {
        const { order } = req.body;

        // Validate order data
        if (!order || !order.items || !order.items.length) {
            return res.status(400).json({
                success: false,
                message: "Invalid order data"
            });
        }

        // Create order
        const newOrder = await orderModel.create({
            user: req.user.id,
            order: {
                ...order,
                status: order.status || "Pending",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        // Push to user's orders array
        await userModel.findByIdAndUpdate(
            req.user.id,
            {
                $push: { orders: newOrder._id }
            }
        );

        // Get user with populated data
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // Send email confirmation
        await sendOrderConfirmationEmail(user, order, newOrder);

        res.status(201).json({
            success: true,
            message: "Order Created Successfully",
            order: newOrder
        });

    } catch (err) {
        console.error("Create Order Error:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Something went wrong"
        });
    }
};

/* =========================
   SEND ORDER CONFIRMATION EMAIL
========================= */

const sendOrderConfirmationEmail = async (user, order, newOrder) => {
    const emailHTML = getEmailTemplate(user, order, newOrder);
    
    await transporter.sendMail({
        from: `"NexXcart Support" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Order Confirmed #${order.orderId} - Thank You for Your Purchase 🎉`,
        html: emailHTML,
    });
};

/* =========================
   EMAIL TEMPLATE
========================= */

const getEmailTemplate = (
  user,
  order,
  newOrder
) => {

  /* =========================
     GST CALCULATION
  ========================= */

  const subtotal =
    Number(order.total || 0);

  let gst =
    subtotal * 0.03;

  /* GST MAX LIMIT */

  if (gst > 1000) {
    gst = 1000;
  }

  const finalTotal =
    subtotal + gst;

  return `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8" />

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>

<title>
  Order Confirmation
</title>

</head>

<body
  style="
    margin:0;
    padding:0;
    background:#F7F7F7;
    font-family:
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      sans-serif;
  "
>

<div
  style="
    max-width:650px;
    margin:40px auto;
    background:#ffffff;
    border-radius:20px;
    overflow:hidden;
    box-shadow:
      0 10px 40px rgba(0,0,0,0.08);
  "
>

<!-- HEADER -->

<div
  style="
    background:
      linear-gradient(
        135deg,
        #FFB22C,
        #854836
      );

    padding:45px 30px;
    text-align:center;
  "
>

<h1
  style="
    margin:0;
    color:white;
    font-size:32px;
    font-weight:800;
  "
>

  Order Confirmed 🎉

</h1>

<p
  style="
    margin-top:12px;
    color:
      rgba(255,255,255,0.9);

    font-size:16px;
  "
>

  Thank you for shopping
  with NexXcart

</p>

</div>

<!-- CONTENT -->

<div style="padding:35px;">

<!-- GREETING -->

<div style="margin-bottom:30px;">

<h2
  style="
    margin:0 0 10px;
    color:#000;
    font-size:24px;
  "
>

Hello
${user.name ||
  user.username ||
  "Customer"}

👋

</h2>

<p
  style="
    margin:0;
    color:#666;
    line-height:1.7;
  "
>

Your order has been placed
successfully and is now
being processed.

</p>

</div>

<!-- STATUS -->

<div
  style="
    background:#fff8ec;
    border-left:
      5px solid #FFB22C;

    border-radius:14px;

    padding:22px;

    margin-bottom:30px;
  "
>

<div
  style="
    display:flex;
    justify-content:
      space-between;

    flex-wrap:wrap;
    gap:20px;
  "
>

<div>

<span
  style="
    font-size:12px;
    color:#854836;
    letter-spacing:1px;
    font-weight:700;
  "
>

ORDER STATUS

</span>

<h3
  style="
    margin:8px 0 0;
    color:#000;
    font-size:20px;
  "
>

${order.status || "Pending"}

</h3>

</div>

<div style="text-align:right;">

<span
  style="
    font-size:12px;
    color:#854836;
    letter-spacing:1px;
    font-weight:700;
  "
>

ORDER DATE

</span>

<p
  style="
    margin:8px 0 0;
    color:#000;
    font-weight:600;
  "
>

${new Date().toLocaleDateString(
  "en-IN",
  {
    day: "numeric",
    month: "long",
    year: "numeric"
  }
)}

</p>

</div>

</div>

</div>

<!-- ORDER DETAILS -->

<div style="margin-bottom:30px;">

<h3
  style="
    margin:0 0 18px;
    color:#000;
    font-size:20px;
    border-bottom:
      2px solid #f3f3f3;

    padding-bottom:10px;
  "
>

Order Details

</h3>

<table
  style="
    width:100%;
    border-collapse:collapse;
  "
>

<tr>

<td
  style="
    padding:12px 0;
    color:#777;
  "
>

Order ID

</td>

<td
  style="
    padding:12px 0;
    text-align:right;
    color:#000;
    font-weight:700;
  "
>

#${order.orderId || newOrder._id}

</td>

</tr>

<tr>

<td
  style="
    padding:12px 0;
    color:#777;
  "
>

Payment Method

</td>

<td
  style="
    padding:12px 0;
    text-align:right;
    color:#000;
    font-weight:600;
  "
>

${order.paymentMethod ||
  "Cash on Delivery"}

</td>

</tr>

</table>

</div>

<!-- ITEMS -->

${order.items &&
order.items.length
? `

<div style="margin-bottom:30px;">

<h3
  style="
    margin:0 0 18px;
    color:#000;
    font-size:20px;
    border-bottom:
      2px solid #f3f3f3;

    padding-bottom:10px;
  "
>

Items Ordered

</h3>

<table
  style="
    width:100%;
    border-collapse:collapse;
  "
>

<thead>

<tr
  style="
    background:#fff8ec;
  "
>

<th
  style="
    padding:12px;
    text-align:left;
    color:#854836;
  "
>

Product

</th>

<th
  style="
    padding:12px;
    text-align:center;
    color:#854836;
  "
>

Qty

</th>

<th
  style="
    padding:12px;
    text-align:right;
    color:#854836;
  "
>

Price

</th>

</tr>

</thead>

<tbody>

${order.items.map(item => `

<tr>

<td
  style="
    padding:14px 10px;
    border-bottom:
      1px solid #eee;

    color:#000;
  "
>

${item.name || item.title}

</td>

<td
  style="
    padding:14px 10px;
    text-align:center;
    border-bottom:
      1px solid #eee;

    color:#555;
  "
>

${item.quantity}

</td>

<td
  style="
    padding:14px 10px;
    text-align:right;
    border-bottom:
      1px solid #eee;

    color:#000;
    font-weight:600;
  "
>

₹${(
  item.price *
  20 *
  (1 -
    item.discountPercentage /
      100)
).toFixed(2)}

</td>

</tr>

`).join("")}

<!-- SUBTOTAL -->

<tr>

<td
  colspan="2"
  style="
    padding:14px 10px;
    text-align:right;
    color:#777;
    font-weight:600;
  "
>

Subtotal

</td>

<td
  style="
    padding:14px 10px;
    text-align:right;
    color:#000;
    font-weight:700;
  "
>

₹${subtotal.toFixed(2)}

</td>

</tr>

<!-- GST -->

<tr>

<td
  colspan="2"
  style="
    padding:14px 10px;
    text-align:right;
    color:#777;
    font-weight:600;
  "
>

GST (3%)

</td>

<td
  style="
    padding:14px 10px;
    text-align:right;
    color:#000;
    font-weight:700;
  "
>

₹${gst.toFixed(2)}

</td>

</tr>

<!-- TOTAL -->

<tr
  style="
    background:#fff8ec;
  "
>

<td
  colspan="2"
  style="
    padding:18px 10px;
    text-align:right;
    font-weight:800;
    color:#000;
    font-size:18px;
  "
>

Grand Total

</td>

<td
  style="
    padding:18px 10px;
    text-align:right;
    font-weight:800;
    color:#854836;
    font-size:22px;
  "
>

₹${finalTotal.toFixed(2)}

</td>

</tr>

</tbody>

</table>

</div>

`
: ""}

<!-- ADDRESS -->

${order.address
? `

<div
  style="
    background:#fff8ec;
    border-radius:16px;
    padding:22px;
    margin-bottom:30px;
  "
>

<h3
  style="
    margin:0 0 12px;
    color:#000;
  "
>

📦 Shipping Address

</h3>

<p
  style="
    margin:0;
    color:#555;
    line-height:1.7;
  "
>

${order.address.name ||
  user.name}

<br>

${order.address.street ||
  order.address.addressLine1 ||
  ""}

<br>

${order.address.city || ""},
${order.address.state || ""}

-
${order.address.pincode ||
  order.address.zip ||
  ""}

</p>

</div>

`
: ""}

<!-- NEXT -->

<div
  style="
    background:#fff8ec;
    border-radius:16px;
    padding:22px;
    margin-bottom:30px;
  "
>

<h3
  style="
    margin:0 0 12px;
    color:#854836;
  "
>

✅ What's Next?

</h3>

<ul
  style="
    margin:0;
    padding-left:20px;
    color:#555;
    line-height:1.8;
  "
>

<li>
We'll notify you when
your order ships
</li>

<li>
Track order from your
dashboard
</li>

<li>
Delivery usually takes
3–5 business days
</li>

</ul>

</div>

<!-- FOOTER -->

<div
  style="
    text-align:center;
    padding-top:25px;
    border-top:
      1px solid #eee;
  "
>

<p
  style="
    margin:0;
    color:#999;
    font-size:13px;
  "
>

©
${new Date().getFullYear()}

NexXcart.
All rights reserved.

</p>

</div>

</div>

</div>

</body>

</html>

`;
};

/* =========================
   GET ORDERS
========================= */

const getOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        
        let query = { user: req.user.id };
        
        if (status && status !== 'all') {
            query["order.status"] = status;
        }
        
        const orders = await orderModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        
        const totalOrders = await orderModel.countDocuments(query);
        
        res.status(200).json({
            success: true,
            totalOrders,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: parseInt(page),
            orders
        });
        
    } catch (err) {
        console.error("Get Orders Error:", err);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

/* =========================
   GET SINGLE ORDER
========================= */

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const order = await orderModel.findOne({
            _id: id,
            user: req.user.id
        });
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        
        res.status(200).json({
            success: true,
            order
        });
        
    } catch (err) {
        console.error("Get Order Error:", err);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

/* =========================
   UPDATE ORDER STATUS
========================= */

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const validStatuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }
        
        const order = await orderModel.findByIdAndUpdate(
            id,
            {
                "order.status": status,
                "order.updatedAt": new Date()
            },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Order status updated",
            order
        });
        
    } catch (err) {
        console.error("Update Order Error:", err);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

/* =========================
   EXPORTS
========================= */

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus
};