const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Send password reset link
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    // check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Your Email is not registered with us",
      });
    }

    // generate token
    const token = crypto.randomUUID();

    // store token and expiry in user document
    await User.findOneAndUpdate(
      { email },
      {
        token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000, // 5 minutes
      },
      { new: true }
    );

    // create password reset link
    const url = `http://localhost:3000/update-password/${token}`;

    // send mail
    await mailSender(
      email,
      "Password Reset Link",
      `Click this link to reset your password: ${url}`
    );

    return res.status(200).json({
      success: true,
      message: "Email sent successfully. Please check your inbox.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending the reset password mail",
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { password, token } = req.body;
     console.log("Incoming reset request:", { password, token });

    // find user with token
    const user = await User.findOne({ token });
     console.log("User found:", user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // check expiry
     console.log("Token expiry time:", user.resetPasswordExpires, "Current:", Date.now());
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token has expired. Please request a new link.",
      });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
     console.log("Generated hashed password:", hashedPassword);


    // update password and clear token fields
    user.password = hashedPassword;
    user.token = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
     console.log("User updated successfully:", user);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting the password",
    });
  }
};
