const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// Main auth middleware
const auth = async (req, res, next) => {
  try {
    console.log("Auth middleware triggered");

    const token =
      req.cookies?.token ||
      req.body?.token ||
      req.headers?.authorization?.split(" ")[1]; // safer split


       console.log("Token from request:", token);
    console.log("Secret used for verification:", JSON.stringify(process.env.JWT_SECRET));


    if (!token) {
      console.log("No token found in request");
      return res.status(401).json({ success: false, message: "Token is missing" });
    }

    console.log("Token received:", token);

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);
    } catch (err) {
      console.log("JWT verification failed:", err.message);
      return res.status(401).json({ success: false, message: "Token is invalid or expired" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("User not found in DB for ID:", decoded.id);
      return res.status(401).json({ success: false, message: "User not found" });
    }

    console.log("User fetched from DB:", user.email, user.role);

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong validating the token",
    });
  }
};

// Only allow Customers
const isCustomer = (req, res, next) => {
  try {
    if (req.user.role !== "Customer") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for customers only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

// Only allow Admins
const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

module.exports = {
  auth,
  isCustomer,
  isAdmin,
};

