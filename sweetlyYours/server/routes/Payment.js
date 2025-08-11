const express = require("express");
const router = express.Router();


const { capturePayment, verifySignature } = require("../controllers/Payment");
const { auth, isInstructor, isCustomer, isAdmin } = require("../middlewares/auth");
router.post("/capturePayment", auth, isCustomer, capturePayment);
router.post("/verifySignature", verifySignature);

module.exports = router;