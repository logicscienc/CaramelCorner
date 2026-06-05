const { instance } = require("../config/razorpay");
const Order = require("../models/Order");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const Cart = require("../models/Cart");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");

// capture the payment and initiate the Razorpay order
// ===============================
// 1. CAPTURE PAYMENT (CREATE RAZORPAY ORDER)
// ===============================
exports.capturePayment = async (req, res) => {
  try {
    console.log("🔵 ENTERED capturePayment");

    const { orderId } = req.body;
    const userId = req.user.id;

    console.log("🟡 orderId received:", orderId);
    console.log("🟡 userId from token:", userId);

    if (!orderId) {
      console.log("❌ Missing orderId");
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // fetch order
    const order = await Order.findById(orderId);

    console.log("🟢 ORDER FOUND:", order);

    if (!order) {
      console.log("❌ Order not found in DB");
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.userId.toString() !== userId) {
      console.log("❌ User mismatch");
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentStatus === "Paid") {
      console.log("⚠️ Payment already done");
      return res.status(400).json({
        success: false,
        message: "Payment already completed",
      });
    }

    if (!order.products.length) {
      console.log("❌ Empty products array");
      return res.status(400).json({
        success: false,
        message: "Order has no products",
      });
    }

    console.log("🟣 ORDER DATA:", order);
    console.log("🟣 TOTAL AMOUNT:", order.totalAmount);
    console.log("🟣 RAZORPAY INSTANCE EXISTS:", !!instance);

    const amount = Number(order.totalAmount);

    console.log("🟣 CONVERTED AMOUNT:", amount);

    if (!amount || isNaN(amount)) {
      console.log("❌ Invalid amount");
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

   const options = {
  amount: Math.round(amount * 100),
  currency: "INR",
  receipt: `rcpt_${order._id.toString().slice(-8)}_${Date.now().toString().slice(-6)}`,
  notes: {
    orderId: order._id.toString(),
    userId: userId,
  },
};

    console.log("🟠 RAZORPAY OPTIONS:", options);

    let paymentResponse;

    try {
      paymentResponse = await instance.orders.create(options);
      console.log("🟢 RAZORPAY SUCCESS RESPONSE:", paymentResponse);
    } catch (razorpayError) {
      console.error("🔥 RAZORPAY ERROR FULL:", razorpayError);

      return res.status(500).json({
        success: false,
        message:
          razorpayError?.error?.description ||
          razorpayError?.message ||
          "Razorpay order creation failed",
      });
    }

    // store razorpay order id
    order.razorpayOrderId = paymentResponse.id;
    await order.save();

    console.log("🟢 ORDER UPDATED WITH RAZORPAY ID");

    return res.status(200).json({
      success: true,
      razorpayOrderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("🔥 Capture Payment Outer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not initiate payment",
    });
  }
};

// ===============================
// 2. VERIFY PAYMENT (MAIN LOGIC)
// ===============================
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const userId = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    // verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // find order using razorpay order id
    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
      userId,
    }).populate("userId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentStatus === "Paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
      });
    }

    // update order
   // update order
order.paymentStatus = "Paid";
order.razorpayPaymentId = razorpay_payment_id;
order.razorpaySignature = razorpay_signature;
order.orderStatus = "Placed";

await order.save();

const cart = await Cart.findOne({ userId });

console.log("USER ID:", userId);
console.log("FOUND CART:", cart);

if (cart) {
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();
  console.log("CART CLEARED");
}

    // send email
    const user = order.userId;

    await mailSender(
      user.email,
      "🎉 Payment Successful - Sweetly Yours",
      paymentSuccessEmail(
        user.name,
        order.totalAmount,
        order._id,
        razorpay_payment_id
      )
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });

  } catch (error) {
    console.error("Verify Payment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

// send payment success email
// exports.sendPaymentSuccessEmail = async(req, res) => {
//   try {
//      const { orderId, paymentId, amount } = req.body;
//     const userId = req.user.id;

//     // validation
//     if (!orderId || !paymentId || !amount || !userId) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide all required details",
//       });
//     }

//     // fetch order + user
//     const order = await Order.findById(orderId).populate("userId");

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     const user = order.userId;

//     // build email HTML
//     const emailHTML = paymentSuccessEmail(
//       user.name,
//       amount,
//       orderId,
//       paymentId
//     );

//     // send email
//     await mailSender(
//       user.email,
//       "🎉 Payment Successful - Sweetly Yours",
//       emailHTML
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Payment success email sent",
//     });

//   } catch(error)
//   {
//      console.error("sendPaymentSuccessEmail error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Could not send payment email",
//       error: error.message,
//     });
//   }
// };

