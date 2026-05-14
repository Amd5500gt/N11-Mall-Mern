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

const getEmailTemplate = (user, order, newOrder) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
    </head>
    <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f4f4f4;line-height:1.6;">
        <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);padding:40px 30px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">Order Confirmed! 🎉</h1>
                <p style="margin:10px 0 0;color:rgba(255,255,255,0.9);font-size:16px;">Thank you for shopping with NexXcart</p>
            </div>
            
            <!-- Content -->
            <div style="padding:30px">
                
                <!-- Greeting -->
                <div style="margin-bottom:25px;">
                    <h2 style="margin:0 0 10px;color:#333333;font-size:20px;">Hello ${user.name || user.username || "Customer"},</h2>
                    <p style="margin:0;color:#555555;">Your order has been placed successfully and is being processed.</p>
                </div>
                
                <!-- Status Card -->
                <div style="background:#f8f9fa;border-radius:10px;padding:20px;margin-bottom:25px;border-left:4px solid #4caf50;">
                    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">
                        <div>
                            <span style="color:#666666;font-size:12px;text-transform:uppercase;letter-spacing:1px;">ORDER STATUS</span>
                            <h3 style="margin:5px;color:#4caf50;font-size:18px;">${order.status || "Pending"}</h3>
                        </div>
                        <div style="text-align:right;">
                            <span style="color:#666666;font-size:12px;text-transform:uppercase;letter-spacing:1px;">ORDER DATE</span>
                            <p style="margin:5px;color:#333333;font-weight:500;">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                </div>
                
                <!-- Order Details -->
                <div style="margin-bottom:25px;">
                    <h3 style="margin:0 0 15px;color:#333333;font-size:18px;border-bottom:2px solid #f0f0f0;padding-bottom:10px;">Order Details</h3>
                    <table style="width:100%;border-collapse:collapse;">
                        <tr>
                            <td style="padding:10px 0;color:#666666;">Order ID:</td>
                            <td style="padding:10px 0;color:#333333;font-weight:600;">#${order.orderId || newOrder._id}</td>
                        </tr>
                        <tr>
                            <td style="padding:10px 0;color:#666666;">Payment Method:</td>
                            <td style="padding:10px 0;color:#333333;font-weight:500;">${order.paymentMethod || "Cash on Delivery"}</td>
                        </tr>
                        <tr>
                            <td style="padding:10px 0;color:#666666;">Total Amount:</td>
                            <td style="padding:10px 0;color:#667eea;font-size:20px;font-weight:700;">₹${order.total || 0}</td>
                        </tr>
                    </table>
                </div>
                
                <!-- Items Ordered -->
                ${order.items && order.items.length ? `
                <div style="margin-bottom:25px;">
                    <h3 style="margin:0 0 15px;color:#333333;font-size:18px;border-bottom:2px solid #f0f0f0;padding-bottom:10px;">Items Ordered</h3>
                    <table style="width:100%;border-collapse:collapse;">
                        <thead>
                            <tr style="background:#f8f9fa;">
                                <th style="text-align:left;padding:10px;color:#666666;">Product</th>
                                <th style="text-align:center;padding:10px;color:#666666;">Qty</th>
                                <th style="text-align:right;padding:10px;color:#666666;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                            <tr>
                                <td style="padding:10px;color:#333333;border-bottom:1px solid #e0e0e0;">${item.name || item.title}</td>
                                <td style="text-align:center;padding:10px;color:#555555;border-bottom:1px solid #e0e0e0;">${item.quantity}</td>
                                <td style="text-align:right;padding:10px;color:#555555;border-bottom:1px solid #e0e0e0;">₹${(item.price*20 * (1 - item.discountPercentage / 100)).toFixed(2)}</td>
                            </tr>
                            `).join('')}
                            <tr style="background:#f8f9fa;">
                                <td colspan="2" style="padding:15px 10px;text-align:right;font-weight:600;">Grand Total:</td>
                                <td style="padding:15px 10px;text-align:right;font-weight:700;color:#667eea;font-size:18px;">₹${order.total}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                ` : ''}
                
                <!-- Shipping Address -->
                ${order.address ? `
                <div style="background:#f8f9fa;border-radius:10px;padding:20px;margin-bottom:25px;">
                    <h3 style="margin:0 0 10px;color:#333333;font-size:16px;">📦 Shipping Address</h3>
                    <p style="margin:0;color:#555555;line-height:1.5;">
                        ${order.address.name || user.name}<br>
                        ${order.address.street || order.address.addressLine1 || ""}<br>
                        ${order.address.city || ""}, ${order.address.state || ""} - ${order.address.pincode || order.address.zip || ""}
                    </p>
                </div>
                ` : ''}
                
                <!-- What's Next -->
                <div style="background:#e8f5e9;border-radius:10px;padding:20px;margin-bottom:25px;">
                    <h3 style="margin:0 0 10px;color:#2e7d32;font-size:16px;">✅ What's Next?</h3>
                    <ul style="margin:0;padding-left:20px;color:#555555;">
                        <li style="margin:5px 0;">We'll send you a confirmation once your order is shipped</li>
                        <li style="margin:5px 0;">Track your order status in your account dashboard</li>
                        <li style="margin:5px 0;">Delivery typically takes 3-5 business days</li>
                    </ul>
                </div>
                
                <!-- Footer -->
                <div style="text-align:center;padding:20px 0 0;border-top:1px solid #e0e0e0;">
                   
                    <p style="margin:0;color:#999999;font-size:12px;">
                        © ${new Date().getFullYear()} NexXcart. All rights reserved.
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