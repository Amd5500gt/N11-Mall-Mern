const orderModel =
    require("../../Models/orderModel");

const userModel =
    require("../../Models/userModel");

const nodemailer =
    require("nodemailer");

/* =========================
   MAIL TRANSPORTER
========================= */

const transporter =
    nodemailer.createTransport({

        service: "gmail",

        auth: {

            user:
                process.env.EMAIL,

            pass:
                process.env.EMAIL_PASS,

        },

    });

/* =========================
   CREATE ORDER
========================= */

const createOrder = async (
    req,
    res
) => {

    try {

        const { order } =
            req.body;

        // CREATE ORDER
        const newOrder =
            await orderModel.create({

                user:
                    req.user._id,

                order,

            });

        // PUSH TO USER
        await userModel.findByIdAndUpdate(

            req.user._id,

            {

                $push: {

                    orders:
                        newOrder._id

                },

            }

        );

        // GET USER
        const user =
            await userModel.findById(
                req.user._id
            );
        await transporter.sendMail({

            from:
  `"NexXcart Support" <${process.env.EMAIL}>`,

            to:
                user.email,

            subject:
                `Order Confirmed #${order.orderId} - Thank You for Your Purchase 🎉`,

            html: `

    <!DOCTYPE html>

    <html>

    <head>

      <meta charset="UTF-8">

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      >

      <title>
        Order Confirmation
      </title>

    </head>

    <body style="
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f4f4f4;
      line-height: 1.6;
    ">

      <div style="
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      ">

        <!-- HEADER -->

        <div style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 30px;
          text-align: center;
        ">

          <h1 style="
            margin: 0;
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
          ">

            Order Confirmed! 🎉

          </h1>

          <p style="
            margin: 10px 0 0;
            color: rgba(255,255,255,0.9);
            font-size: 16px;
          ">

            Thank you for shopping with us

          </p>

        </div>

        <!-- CONTENT -->

        <div style="padding: 30px">

          <!-- GREETING -->

          <div style="margin-bottom: 25px">

            <h2 style="
              margin: 0 0 10px;
              color: #333333;
              font-size: 20px;
            ">

              Hello ${user.name},

            </h2>

            <p style="
              margin: 0;
              color: #555555;
            ">

              Your order has been placed successfully and is being processed.

            </p>

          </div>

          <!-- STATUS -->

          <div style="
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 25px;
            border-left: 4px solid #4caf50;
          ">

            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-wrap: wrap;
            ">

              <div>

                <span style="
                  color: #666666;
                  font-size: 12px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                ">

                  ORDER STATUS

                </span>

                <h3 style="
                  margin: 5px 0 0;
                  color: #4caf50;
                  font-size: 18px;
                ">

                  ${order.status || "Pending"}

                </h3>

              </div>

              <div style="text-align: right;">

                <span style="
                  color: #666666;
                  font-size: 12px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                ">

                  ORDER DATE

                </span>

                <p style="
                  margin: 5px 0 0;
                  color: #333333;
                  font-weight: 500;
                ">

                  ${new Date().toLocaleDateString(
                'en-IN',
                {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }
            )}

                </p>

              </div>

            </div>

          </div>

          <!-- ORDER DETAILS -->

          <div style="margin-bottom: 25px">

            <h3 style="
              margin: 0 0 15px;
              color: #333333;
              font-size: 18px;
              border-bottom: 2px solid #f0f0f0;
              padding-bottom: 10px;
            ">

              Order Details

            </h3>

            <table style="
              width: 100%;
              border-collapse: collapse;
            ">

              <tr>

                <td style="
                  padding: 10px 0;
                  color: #666666;
                ">

                  Order ID:

                </td>

                <td style="
                  padding: 10px 0;
                  color: #333333;
                  font-weight: 600;
                ">

                  #${order.orderId}

                </td>

              </tr>

              <tr>

                <td style="
                  padding: 10px 0;
                  color: #666666;
                ">

                  Payment Method:

                </td>

                <td style="
                  padding: 10px 0;
                  color: #333333;
                  font-weight: 500;
                ">

                  ${order.paymentMethod || "Cash on Delivery"}

                </td>

              </tr>

              <tr>

                <td style="
                  padding: 10px 0;
                  color: #666666;
                ">

                  Total Amount:

                </td>

                <td style="
                  padding: 10px 0;
                  color: #667eea;
                  font-size: 20px;
                  font-weight: 700;
                ">

                  ₹${order.total}

                </td>

              </tr>

            </table>

          </div>

          <!-- ITEMS -->

          ${order.items?.length ? `

          <div style="margin-bottom: 25px">

            <h3 style="
              margin: 0 0 15px;
              color: #333333;
              font-size: 18px;
              border-bottom: 2px solid #f0f0f0;
              padding-bottom: 10px;
            ">

              Items Ordered

            </h3>

            <table style="
              width: 100%;
              border-collapse: collapse;
            ">

              <thead>

                <tr>

                  <th style="
                    text-align: left;
                    padding: 10px 0;
                    color: #666666;
                    border-bottom: 1px solid #e0e0e0;
                  ">

                    Product

                  </th>

                  <th style="
                    text-align: center;
                    padding: 10px 0;
                    color: #666666;
                    border-bottom: 1px solid #e0e0e0;
                  ">

                    Qty

                  </th>

                  <th style="
                    text-align: right;
                    padding: 10px 0;
                    color: #666666;
                    border-bottom: 1px solid #e0e0e0;
                  ">

                    Price

                  </th>

                </tr>

              </thead>

              <tbody>

                ${order.items.map(item => `

                  <tr>

                    <td style="
                      padding: 10px 0;
                      color: #333333;
                    ">

                      ${item.name || item.title}

                    </td>

                    <td style="
                      text-align: center;
                      padding: 10px 0;
                      color: #555555;
                    ">

                      ${item.quantity}

                    </td>

                    <td style="
                      text-align: right;
                      padding: 10px 0;
                      color: #555555;
                    ">

                      ₹${item.price}

                    </td>

                  </tr>

                `).join('')}

                <tr style="
                  border-top: 2px solid #e0e0e0;
                ">

                  <td
                    colspan="2"
                    style="
                      padding: 15px 0 10px;
                      text-align: right;
                      font-weight: 600;
                    "
                  >

                    Grand Total:

                  </td>

                  <td style="
                    padding: 15px 0 10px;
                    text-align: right;
                    font-weight: 700;
                    color: #667eea;
                    font-size: 18px;
                  ">

                    ₹${order.total}

                  </td>

                </tr>

              </tbody>

            </table>

          </div>

          ` : ''}

          <!-- SHIPPING ADDRESS -->

          ${order.address ? `

          <div style="
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 25px;
          ">

            <h3 style="
              margin: 0 0 10px;
              color: #333333;
              font-size: 16px;
            ">

              📦 Shipping Address

            </h3>

            <p style="
              margin: 0;
              color: #555555;
              line-height: 1.5;
            ">

              ${order.address.name || user.name}<br>

              ${order.address.addressLine1}<br>

              ${order.address.city},
              ${order.address.state}
              -
              ${order.address.pincode}

            </p>

          </div>

          ` : ''}

          <!-- NEXT -->

          <div style="
            background: #e8f5e9;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 25px;
          ">

            <h3 style="
              margin: 0 0 10px;
              color: #2e7d32;
              font-size: 16px;
            ">

              ✅ What's Next?

            </h3>

            <ul style="
              margin: 0;
              padding-left: 20px;
              color: #555555;
            ">

              <li style="margin: 5px 0;">
                We'll send you a confirmation once your order is shipped
              </li>

              <li style="margin: 5px 0;">
                Track your order status in your account dashboard
              </li>

              <li style="margin: 5px 0;">
                Delivery typically takes 3-5 business days
              </li>

            </ul>

          </div>

          <!-- FOOTER -->

          <div style="
            text-align: center;
            padding: 20px 0 0;
            border-top: 1px solid #e0e0e0;
          ">

            <p style="
              margin: 0;
              color: #999999;
              font-size: 12px;
            ">

              © ${new Date().getFullYear()}
 NexXcart.
              All rights reserved.

            </p>

          </div>

        </div>

      </div>

    </body>

    </html>

  `,

        });

        res.status(201).json({

            success: true,

            message:
                "Order Created Successfully",

            order: newOrder

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message:
                "Something went wrong"

        });

    }

};

/* =========================
   GET ORDERS
========================= */

const getOrders = async (
    req,
    res
) => {

    try {

        const orders =
            await orderModel

                .find({

                    user:
                        req.user._id

                })

                .sort({

                    createdAt: -1

                });

        res.status(200).json({

            success: true,

            totalOrders:
                orders.length,

            orders

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message:
                "Something went wrong",

        });

    }

};

module.exports = {
    createOrder,
    getOrders
};