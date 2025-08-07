const express = require("express")
const router = express.Router()


// import from Order controller
const {createOrder, getUserOrders, getOrderById, cancelOrder, } = require("../controllers/Order");

// import from AdminOrder controller
const {getAllOrders, getOrderByIdAdmin, updateOrderStatus, deleteOrder, } = require("../controllers/AdminOrder");

// Importing Middlewares
const { auth, isCustomer, isAdmin } = require("../middlewares/auth")

// Oreder Routes
// this order is created by customer
router.post("/orders", auth, isCustomer, createOrder);
// this order is fetched by customer
router.get("/orders", auth, isCustomer, getUserOrders);
// this detail about a specific order by customer
router.get("/orders/:orderId", auth, isCustomer, getOrderById);
// this order is cancelled by customer
router.put("/orders/:orderId/cancel", auth, isCustomer, cancelOrder);


// Admin Order Routes
// get all orders by admin
router.get("/admin/orders", auth, isAdmin, getAllOrders);
// get order by id by admin
router.get("/admin/orders/:orderId", auth, isAdmin,getOrderByIdAdmin);
// update order status by admin
router.put("/admin/orders/:orderId/status", auth, isAdmin, updateOrderStatus);
// delete order by admin
router.delete("/admin/orders/:orderId", auth, isAdmin, deleteOrder);

module.exports = router;

