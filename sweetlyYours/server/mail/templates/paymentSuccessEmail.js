exports.paymentSuccessEmail = (
  name,
  amount,
  orderId,
  paymentId,
  trackingUrl
) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Payment Successful</title>
      <style>
        body {
          background-color: #fff;
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
        }

        .container {
          max-width: 600px;
          margin: auto;
          padding: 20px;
          text-align: center;
          border: 1px solid #f0f0f0;
        }

        .logo {
          width: 140px;
          margin-bottom: 20px;
        }

        .title {
          font-size: 22px;
          font-weight: bold;
          color: #800000; /* maroon tone */
        }

        .box {
          background: #fff5f7;
          padding: 20px;
          border-radius: 10px;
          margin-top: 20px;
          text-align: left;
        }

        .highlight {
          font-weight: bold;
          color: #800000;
        }

        .btn {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 20px;
          background: #800000;
          color: #fff;
          text-decoration: none;
          border-radius: 6px;
        }

        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #777;
        }
      </style>
    </head>

    <body>
      <div class="container">

        <!-- Logo -->
        <img class="logo" src="/Logo/logo.png" alt="Sweetly Yours Logo" />

        <div class="title">🎉 Payment Successful!</div>

        <p>Hi <b>${name}</b>,</p>
        <p>Thank you for your order at <b>Sweetly Yours</b> 💖</p>

        <div class="box">
          <p>💰 Amount Paid: <span class="highlight">₹${amount}</span></p>
          <p>🧾 Order ID: <span class="highlight">${orderId}</span></p>
          <p>💳 Payment ID: <span class="highlight">${paymentId}</span></p>
        </div>

        <a class="btn" href="${trackingUrl}">
          Track Your Order 🚚
        </a>

        <div class="footer">
          If you have any questions, feel free to contact our support team.
          <br />
          Sweetly Yours — Made with love 🍰
        </div>
      </div>
    </body>
  </html>
  `;
};