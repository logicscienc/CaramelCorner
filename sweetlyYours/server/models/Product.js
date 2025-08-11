const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    longDescription: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: {
      type: [String], // allow multiple images
      required: true,
    },
    brand: {
      type: String,
      default: "CaramelCorner",
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    weight: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        type: String,
        required: true,
      },
    ],
    instructions: {
      type: String,
      required: true,
      trim: true,
    },
    expertTips: {
      type: String,
      trim: true,
    },
    shippingDetails: {
      type: String,
      required: true,
      trim: true,
    },
    averageRating: {
      type: Number, 
      default: 0
    },
    reviewCount: {
      type: Number, 
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

