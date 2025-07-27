const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ["registration", "login"],
    require:true,

  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60,
  },
});

// a function -> to send emails
async function sendVerificationEmail(email, otp) {
  try {
    await mailSender(
      email,
      "Verification Email from CaramelCorner",
      `<h3>Your OTP is:</h3><p>${otp}</p>`
    );
  } catch (error) {
    console.log("error occured while sending mails:", error);
    throw error;
  }
}

OTPSchema.pre("save", async function (next) {
  await sendVerificationEmail(this.email, this.otp);
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
