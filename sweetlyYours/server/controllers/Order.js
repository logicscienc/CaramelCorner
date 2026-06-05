const Order = require("../models/Order");
const { instance } = require("../config/razorpay");
const Cart = require("../models/Cart");
const mailSender = require("../utils/mailSender");

// create order when a user try to place an order
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentMethod, address } = req.body;

    console.log("DEBUG paymentMethod:", paymentMethod);
    console.log("DEBUG address:", address);

    if (!paymentMethod || !address) {
      return res.status(400).json({
        success: false,
        message: "Payment method and address are required",
      });
    }

    const requiredFields = [
      "recipientName",
      "phone",
      "street",
      "city",
      "pincode",
      "state",
      "country",
    ];

    for (let field of requiredFields) {
      if (!address[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing ${field} in address`,
        });
      }
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const products = cart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    const totalAmount = cart.items.reduce(
      (acc, item) => acc + item.productId.price * item.quantity,
      0
    );

    const order = await Order.create({
      userId,
      products,
      totalAmount,
      paymentMethod,
      paymentStatus: "Pending",
      orderStatus: "Placed",
      address,
    });

   

    return res.status(201).json({
      success: true,
      orderId: order._id,
      order,
    });

  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get user Orders if a user wants to see there order histry
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("products.productId", "name price image");

    if (!orders.length) {
      return res.status(200).json({
        success: true,
        count: 0,
        orders: [],
        message: "No orders found",
      });
    }

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.error("Error fetching user orders:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch orders",
      error: error.message,
    });
  }
};

// get order by id, if a user wants to know about there resent order. 
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(orderId)
      .populate("products.productId", "name price image description")
      .populate("userId", "name email phone");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Security check
    if (order.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.error("Error fetching order:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch order",
      error: error.message,
    });
  }
};

// for canceling the order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Please provide cancellation reason",
      });
    }

    const order = await Order.findById(orderId)
      .populate("products.productId")
      .populate("userId", "name email");

    if (!order || order.userId._id.toString() !== userId) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Already cancelled
    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order already cancelled",
      });
    }

    // Cannot cancel after preparation starts
    if (
      order.orderStatus === "Preparing" ||
      order.orderStatus === "Out For Delivery" ||
      order.orderStatus === "Delivered"
    ) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled now",
      });
    }

    // Save cancellation reason
    order.cancellationReason = reason;
    order.orderStatus = "Cancelled";

    await order.save();

    // Send cancellation email
    await mailSender(
      order.userId.email,
      "Order Cancelled - Sweetly Yours",
      `
      <h2>Order Cancelled ❌</h2>

      <p>Hello ${order.userId.name},</p>

      <p>Your order has been cancelled successfully.</p>

      <p><b>Order ID:</b> ${order._id}</p>
      <p><b>Reason:</b> ${reason}</p>

      <p>If you need any assistance, please contact our support team.</p>

      <p>Sweetly Yours ❤️</p>
      `
    );

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });

  } catch (error) {
    console.error("Cancel Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not cancel order",
      error: error.message,
    });
  }
};

// update irder status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating order status",
    });
  }
};
