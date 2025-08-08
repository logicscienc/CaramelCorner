// import the required modules
const express = require("express");
const router = express.Router();


// import the required controllers and middleware function
const {sendOTP, signUp, login, loginWithOTP, changePassword, logout} = require("../controllers/Auth");

const {resetPasswordToken, resetPassword,} = require("../controllers/ResetPassword");

const {auth} = require("../middlewares/auth");


// Routes for Login, Signup, sendOTP, loginWithOTP and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Routes for user login
router.post("/login", login)

// login using sending OTP on your email
router.post("/loginWithOTP", loginWithOTP);

// Routes for user signup
router.post("/signUp", signUp)

// Route for sending OTP to the user's email
router.post("/sendOTP", sendOTP)

// Route for logout
router.post("/logout", auth, logout)

// Route for Changing the password
router.post("/changepassword", auth, changePassword)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

// Export the router for use in the main application
module.exports = router;