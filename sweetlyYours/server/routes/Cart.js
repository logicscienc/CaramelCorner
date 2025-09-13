const express = require("express")
const router = express.Router()
const { auth, isCustomer } = require("../middlewares/auth")

// import from Cart controller
const {addToCart, getCart, updateCartItem , removeCartItem , clearCart} = require("../controllers/Cart");

// add to cart
router.post("/addToCart", auth, isCustomer, addToCart);

// get cart
router.get("/getCart", auth, isCustomer, getCart);

// update cart items
router.put("/updateCartItem", auth, isCustomer, updateCartItem);

// remove cart Item
router.delete("/removeCartItem/:productId", auth, removeCartItem);


// clear cart
router.delete("/clearCart", auth, clearCart);

module.exports = router;

