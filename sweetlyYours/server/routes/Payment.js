// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifyPayment} = require("../controllers/Payment")


module.exports = router