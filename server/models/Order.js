const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "Card", "NetBanking"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
      required: true,
    },
    transactionId: {
        type:String,
        default: null,
    },
    orderStatus: {
      type: String,
      enum: ["Placed", "Preparing", "Dispatched", "Delivered"],
      default: "Placed",
      required: true,
    },
    //    no need of an array of address because one user have one address.
    address: {
      street: { type: String },
      city: { type: String },
      pincode: { type: String },
      state: { type: String },
      country: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
