const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["Customer", "Admin", "Delivery"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    addresses: [
      {
        street: { type: String },
        city: { type: String },
        pincode: { type: String },
        state: { type: String },
        country: { type: String },
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
  },
  { timestamps: true }
);

async function sendWelcomeEmail(email, name) {
  try {
    const mailResponse = await mailSender(
      email,
      "Welcome to Our Store!",
      `<h3>Hello ${name},</h3><p>Thank you for registering at our store!</p>`
    );
  } catch (error) {
    console.log("Error while sending welcome email:", error);
    throw error;
  }
}

//  Trigger welcome email *after* user is created
userSchema.post("save", async function () {
  try {
    await sendWelcomeEmail(this.email, this.name);
  } catch (error) {
    console.log("Welcome email failed (non-blocking):", error.message);
    
  }
});

module.exports = mongoose.model("User", userSchema);
