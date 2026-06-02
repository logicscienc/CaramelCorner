const express = require("express");
const router = express.Router();

const {
  addAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress,
} = require("../controllers/Address");

const { auth, isCustomer } = require("../middlewares/auth");

// Add address
router.post("/", auth, isCustomer, addAddress);

// Get all addresses
router.get("/", auth, isCustomer, getAddresses);

// Get default address
router.get("/default", auth, isCustomer, getDefaultAddress);

// Get address by id
router.get("/:addressId", auth, isCustomer, getAddressById);

// Update address
router.put("/:addressId", auth, isCustomer, updateAddress);

// Delete address
router.delete("/:addressId", auth, isCustomer, deleteAddress);

// Set default address
router.put("/:addressId/default", auth, isCustomer, setDefaultAddress);

module.exports = router;