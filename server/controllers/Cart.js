const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Helper function to recalculate total price using batch fetch
const calculateTotalPrice = async (cart) => {
  if (!cart.items.length) return 0;

  const productIds = cart.items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  const priceMap = new Map();
  products.forEach((prod) => {
    priceMap.set(prod._id.toString(), prod.price);
  });

  let total = 0;
  for (const item of cart.items) {
    const price = priceMap.get(item.productId.toString()) || 0;
    total += price * item.quantity;
  }

  return total;
};

// add to cart controller
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = parseInt(quantity, 10);
    //as after login user is already authenticated
    const userId = req.user.id;
    // verification

    if (!productId || isNaN(qty) || qty <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
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

    // check stock
    if (product.stock < qty) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds stock",
      });
    }


    // Find cart or create new
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity: qty }],
      });
    } else {
      // Check if product already in cart
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += qty;
      } else {
        cart.items.push({ productId, quantity: qty });
      }
    }
    // Recalculate total
    cart.totalPrice = await calculateTotalPrice(cart);

    // save in db
    await cart.save();
     await cart.populate("items.productId");

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error adding item to cart",
    });
  }
};

// getCart – Fetch all cart items for a user.
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate("items.productId"); // populate product details

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [], totalPrice: 0 },
      });
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching cart",
    });
  }
};

// updateCartItem – Update quantity of a specific item.
exports.updateCartItem = async (req, res) => {
    try{

        const userId = req.user.id;
    const { productId, quantity } = req.body;
const qty = parseInt(quantity, 10);
if (!productId || isNaN(qty) || qty <= 0) {
  return res.status(400).json({
    success: false,
    message: "Product ID and a valid quantity are required",
  });
}


    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // verify if the item quintity which we want to increase does it really exist in the cart or not
     const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    item.quantity = qty;

    cart.totalPrice = await calculateTotalPrice(cart);

    // save in db
     await cart.save();
      await cart.populate("items.productId");

       return res.status(200).json({
      success: true,
      message: "Cart item updated",
      cart,
    });

    }
    catch(error){
         console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error updating cart item",
    });

    }
};

// removeCartItem – Remove an item from cart.
exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Remove item
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    cart.totalPrice = await calculateTotalPrice(cart);

    await cart.save();
    await cart.populate("items.productId");

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error removing item from cart",
    });
  }
};
// clearCart (optional) – Remove all items from a user’s cart.
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error clearing cart",
    });
  }
};
