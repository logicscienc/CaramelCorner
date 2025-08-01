const { instance } = require("../config/razorpay");
const Order = require("../models/Order");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");

// capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  // get userId and productId
  const { orderId } = req.body;
  const userId = req.user.id;

  // Valid productId
  if (!orderId) {
    return res.json({
      success: false,
      message: "Please provide valid order ID",
    });
  }

  // valid product detail
  let order;

  try {
    order = await Order.findById(orderId);

    if (!order || order.userId.toString() !== userId) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Payment already completed for this order",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  //   order create
  const amount = order.totalAmount;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: `receipt_${Date.now()}`,

    notes: {
      orderId: orderId,
      userId,
    },
  };

  try {
    //initiate the payment using razorpay
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);
    //return response
    return res.status(200).json({
      success: true,
        razorpayOrderId: paymentResponse.id,
    
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
        key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Could not initiate payment",
    });
  }
};

// verify signature of razorpay and server

exports.verifySignature = async (req, res) => {
  const webhookSecret = "12345678";
  const signature = req.headers["x-razorpay-signature"];

  const shasum = crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature === digest) {
    console.log("Payment is Authorised");

    // Extract details from Razorpay webhook payload
    const razorpayNotes = req.body.payload.payment.entity.notes;
    const paymentId = req.body.payload.payment.entity.id;
    const appOrderId = razorpayNotes.orderId; // your MongoDB Order ID

    // Update your MongoDB order
    const order = await Order.findById(appOrderId);
    if (order) {
      order.paymentStatus = "Paid";
      order.transactionId = paymentId;
      await order.save();
    }

    return res.status(200).json({ success: true });
  } else {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }
};

