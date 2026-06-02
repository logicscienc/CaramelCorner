const Address = require("../models/Address");


// Add a new address
exports.addAddress = async (req, res) => {
    try{
         const userId = req.user._id; // from auth middleware
    const { label, recipientName, phone, street, city, pincode, state, country, isDefault } = req.body;

    // Validate required fields
    if (
      !label ||
      !recipientName ||
      !phone ||
      !street ||
      !city ||
      !pincode ||
      !state ||
      !country
    ) {
      return res.status(400).json({
        success: false,
        message: "All address fields are required",
      });
    }

     // Unset previous default address
    if (isDefault) {
      await Address.updateMany(
        { userId },
        { $set: { isDefault: false } }
      )};

    const address = await Address.create({
       userId,
      label,
      recipientName,
      phone,
      street,
      city,
      pincode,
      state,
      country,
      isDefault: !!isDefault,
    });

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      address,
    });

    }
   catch (error) {
    console.error("Add Address Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error adding address",
      error: error.message,
    });

    }
};

//  Get all addresses for a user
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user._id;
    const addresses = await Address.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: addresses.length,
      addresses,
    });
  } catch (error) {
  console.error("Get Addresses Error:", error);

  return res.status(500).json({
    success: false,
    message: "Error fetching addresses",
    error: error.message,
  });
}
  
};



// get Address by ID
exports.getAddressById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;

    const address = await Address.findOne({
      _id: addressId,
      userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    console.error("Get Address Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching address",
      error: error.message,
    });
  }
};

//  Update an address
exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;

    const {
      label,
      recipientName,
      phone,
      street,
      city,
      pincode,
      state,
      country,
      isDefault,
    } = req.body;

    const address = await Address.findOne({
      _id: addressId,
      userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // If setting this address as default,
    // remove default from all other addresses
    if (isDefault === true) {
      await Address.updateMany(
        { userId },
        { $set: { isDefault: false } }
      );
    }

    // Update only provided fields
    if (label !== undefined) address.label = label;
    if (recipientName !== undefined)
      address.recipientName = recipientName;
    if (phone !== undefined) address.phone = phone;
    if (street !== undefined) address.street = street;
    if (city !== undefined) address.city = city;
    if (pincode !== undefined) address.pincode = pincode;
    if (state !== undefined) address.state = state;
    if (country !== undefined) address.country = country;
    if (isDefault !== undefined)
      address.isDefault = isDefault;

    await address.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address,
    });

  } catch (error) {
    console.error("Update Address Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error updating address",
      error: error.message,
    });
  }
};

//  Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;

    // Delete address
    const deleted = await Address.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // If deleted address was default,
    // assign another address as default
    if (deleted.isDefault) {
      const nextAddress = await Address.findOne({ userId });

      if (nextAddress) {
        nextAddress.isDefault = true;
        await nextAddress.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error deleting address",
    });
  }
};

// set default Address
exports.setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;

    await Address.updateMany(
      { userId },
      { $set: { isDefault: false } }
    );

    const address = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      { isDefault: true },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Default address updated",
      address,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error setting default address",
    });
  }
};

// get default address
exports.getDefaultAddress = async (req, res) => {
  try {
    const userId = req.user._id;

    const address = await Address.findOne({
      userId,
      isDefault: true,
    });

    return res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching default address",
    });
  }
};