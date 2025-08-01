const Order = require("../models/Order");
const Cart = require("../models/Cart");

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
