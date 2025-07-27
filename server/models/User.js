const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

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
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"],
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
     token: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

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

// to hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

async function sendWelcomeEmail(email, name) {
  try {
    await mailSender(
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
