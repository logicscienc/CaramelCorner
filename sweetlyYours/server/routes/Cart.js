const express = require("express")
const router = express.Router()
const { auth } = require("../middlewares/auth")

// import from Cart controller
const {addToCart, getCart, updateCartItem , removeCartItem , clearCart} = require("../controllers/Cart");

// add to cart
router.post("/addToCart", auth, addToCart);

// get cart
router.get("/getCart", auth, getCart);

// update cart items
router.put("/updateCartItem", auth, updateCartItem);

// remove cart Item
router.delete("/removeCartItem", auth, removeCartItem);

// clear cart
router.delete("/clearCart", auth, clearCart);

module.exports = router;

