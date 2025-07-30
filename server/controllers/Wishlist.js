const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// addToWishlist – Add a product to the wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Create wishlist entry (unique index prevents duplicates)
    const wishlistItem = await Wishlist.create({
      userId,
      productId,
    });

    return res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      wishlistItem,
    });
  } catch (error) {
    console.error(error);

    // Handle duplicate entry (MongoDB error code 11000)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Product is already in wishlist",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error adding to wishlist",
    });
  }
};

// getWishlist – Get all wishlist products for a user
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.find({ userId })
      .populate("productId") // populate product details
      .exec();

    return res.status(200).json({
      success: true,
      count: wishlist.length,
      wishlist,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching wishlist",
    });
  }
};

// removeFromWishlist – Remove a product from the wishlist

exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const deletedItem = await Wishlist.findOneAndDelete({ userId, productId });

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error removing product from wishlist",
    });
  }
};
