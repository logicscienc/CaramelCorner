const Order = require("../models/Order");
const { instance } = require("../config/razorpay");
const Cart = require("../models/Cart");
const mailSender = require("../utils/mailSender");

// create order when a user try to place an order
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentMethod, address } = req.body;

    // validate paymentMethod and address
    if (!paymentMethod || !address) {
      return res.json({
        success: false,
        message:
          "Please provide PaymentMethod and address, where you want your happy meal.",
      });
    }

    // get user's cart info.
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // prepare products array for the order from the populated cart
    const products = cart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price, // taken directly from populated product
    }));

    // calculate total amount directley from populate data
    const totalAmount = cart.items.reduce(
      (acc, item) => acc + item.productId.price * item.quantity,
      0
    );

    // create the order
    const order = await Order.create({
      userId,
      products,
      totalAmount,
      paymentMethod,
      paymentStatus: "Pending", // stays Pending until payment is done
      orderStatus: "Placed",
      address,
    });

    // clear the cart after creating the order and save changes in the db
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      success: true,
      order,
      message:
        paymentMethod === "COD"
          ? "Order placed successfully (COD)"
          : "Order created, proceed to payment",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

// get user Orders if a user wants to see there order histry
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId })
    .sort({ createdAt: -1 })
     // fields to populate: you can include only specific fields from Product model
     .populate("products.productId", "name price image"); 
    ;
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not fetch orders" });
  }
};

// get order by id, if a user wants to know about there resent order. 
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(id).populate("products.productId");
    if (!order || order.userId.toString() !== userId) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ success: false, message: "Could not fetch order" });
  }
};

// for canceling the order
exports.cancelOrder = async (req, res) => {
  try{
    // Order ID from URL
    const { id } = req.params;
    // Cancellation reason from user
    const { reason } = req.body;
    const userId = req.user.id;

    // validate
     if (!reason) {
      return res.json({
        success: false,
        message:
          "Please provide the reason for cancellation.",
      });
    }

    // find the order
    const order = await Order.findById(id)
    .populate("products.productId")
    .populate("userId", "email");
    if (!order || order.userId._id.toString() !== userId) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // only allow cancellation if the order hasn't progressed
     if (order.orderStatus !== "Placed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order at this stage",
      });
    }

    // save cancellation reason
    order.cancellationReason = reason || "No reason provided";

    // handle refunds if payment was online and already paid
     if (order.paymentStatus === "Paid" && order.paymentMethod !== "COD") {
      try {
        const refund = await instance.payments.refund(order.transactionId, {
          amount: order.totalAmount * 100, 
        });

        // Store refund details
        order.refundId = refund.id;
        order.refundStatus = "Initiated";
        order.paymentStatus = "Refunded";
         // Send refund email (inline)

          await mailSender(
          order.userId.email,
          "Refund Initiated for Your Order",
          `
            <h2>Refund Initiated</h2>
            <p>We have initiated a refund for your order <b>${order._id}</b>.</p>
            <p>Refund Amount: ₹${order.totalAmount}</p>
            <p>Refund ID: ${order.refundId}</p>
            <p>The amount will be credited to your account in 5-7 working days.</p>
          `
        );
      } catch (refundError) {
        console.error("Refund failed:", refundError);
        return res.status(500).json({
          success: false,
          message: "Order cancelled but refund could not be initiated. Contact support.",
        });
      }
    }

    // update order status
     order.orderStatus = "Cancelled";
    await order.save();
     // Send cancellation email (inline)
    await mailSender(
      order.userId.email,
      "Order Cancelled",
      `
        <h2>Order Cancelled</h2>
        <p>Your order <b>${order._id}</b> has been cancelled.</p>
        <p>Reason: ${reason}</p>
        <p>If this was a mistake, please contact our support team.</p>
      `
    );

     return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });




  }
  catch(error){
     console.error("Error cancelling order:", error);
    return res.status(500).json({
      success: false,
      message: "Could not cancel order",
    });

  }
};
