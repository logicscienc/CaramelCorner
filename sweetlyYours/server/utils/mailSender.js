const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      }
    });

    let info = await transporter.sendMail({
      from: `"CaramelCorner" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Mail sent:", info.messageId);

    return info;

  } catch(error) {
    console.log("Mail error:", error.message);
    throw error;
  }
};

module.exports = mailSender;
