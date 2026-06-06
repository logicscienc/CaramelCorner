const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {

  console.log("MAILSENDER START");
console.log("MAIL_HOST:", process.env.MAIL_HOST);
console.log("MAIL_USER:", process.env.MAIL_USER);

     if (!email || !title || !body) {
    throw new Error("Missing email, title or body");
  }
  try {
    console.log("CREATING TRANSPORTER");
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    console.log("TRANSPORTER CREATED");

    let info = await transporter.sendMail({
      from: `"🍫 CaramelCorner - Because You Deserve a Treat!" <${process.env.MAIL_USER}>`  ,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    console.log("EMAIL SENT");

    console.log("Mail sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.log("Error sending email:", error.message);
    throw error;
  }
};

module.exports = mailSender;
