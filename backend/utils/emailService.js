const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate order confirmation email HTML
const generateOrderConfirmationEmail = (order, user) => {
  const itemsHTML = order.items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #e0e0e0;">
      <td style="padding: 12px; text-align: left;">${item.productName}</td>
      <td style="padding: 12px; text-align: center;">${item.size}</td>
      <td style="padding: 12px; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 12px; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .order-info {
          background-color: #f0f4ff;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .order-info p {
          margin: 8px 0;
          font-size: 14px;
        }
        .order-info strong {
          color: #667eea;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        table th {
          background-color: #667eea;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: 600;
        }
        .total-row {
          background-color: #f0f4ff;
          font-weight: bold;
          font-size: 16px;
        }
        .total-row td {
          padding: 15px 12px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          font-size: 12px;
          color: #666;
        }
        .thank-you {
          background-color: #e8f5e9;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
          text-align: center;
          color: #2e7d32;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Order Confirmed</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px;">Thank you for your purchase!</p>
        </div>
        
        <div class="content">
          <p>Hi <strong>${user.name}</strong>,</p>
          
          <p>We're excited to confirm that your order has been successfully placed. Your items will be carefully prepared and shipped to you soon.</p>
          
          <div class="order-info">
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</p>
            <p><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
          </div>
          
          <h3 style="margin-top: 25px; margin-bottom: 15px; color: #333;">Order Summary</h3>
          
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Size</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
              <tr class="total-row">
                <td colspan="4" style="text-align: right;">Total Amount:</td>
                <td style="text-align: right;">$${order.totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="thank-you">
            <p style="margin: 0; font-size: 16px;">Thank you for shopping with <strong>Canvas</strong>!</p>
            <p style="margin: 5px 0 0 0; font-size: 13px;">We appreciate your business and look forward to serving you again.</p>
          </div>
          
          <p style="margin-top: 20px;">If you have any questions about your order, please don't hesitate to contact our customer support team.</p>
          
          <div class="footer">
            <p>© 2024 Canvas. All rights reserved.</p>
            <p>This is an automated email. Please do not reply directly to this message.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (order, user) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Order Confirmation - Canvas #${order._id}`,
      html: generateOrderConfirmationEmail(order, user),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    // Don't throw error - email failure should not break checkout
    return false;
  }
};

module.exports = {
  sendOrderConfirmationEmail,
};
