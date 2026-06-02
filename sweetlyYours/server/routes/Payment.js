// Import the required modules
const express = require("express")
const router = express.Router()



const {
  capturePayment,
  verifyPayment,
} = require("../controllers/Payment");

const { auth } = require("../middlewares/auth");

// Create Razorpay Order
router.post(
  "/capture-payment",
  auth,
  capturePayment
);

// Verify Razorpay Payment
router.post(
  "/verify-payment",
  auth,
  verifyPayment
);

module.exports = router;