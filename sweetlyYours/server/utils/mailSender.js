const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: "Sweetly Yours", email: process.env.EMAIL_FROM },
      to: [{ email }],
      subject: title,
      htmlContent: body,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Brevo email failed");
  }

  return data;
};

module.exports = mailSender;
