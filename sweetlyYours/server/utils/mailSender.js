const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    console.log("MAIL_USER:", process.env.MAIL_USER);
console.log("MAIL_PASS_LENGTH:", process.env.MAIL_PASS?.length);
   let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});
    await transporter.verify();
console.log("SMTP VERIFIED");

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
