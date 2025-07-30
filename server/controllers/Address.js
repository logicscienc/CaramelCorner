const Address = require("../models/Address");


// Add a new address
exports.addAddress = async (req, res) => {
    try{
         const userId = req.user.id; // from auth middleware
    const { label, street, city, pincode, state, country, isDefault } = req.body;

    // Validate required fields
    if (!label || !street || !city || !pincode || !state || !country) {
      return res.status(400).json({
        success: false,
        message: "All address fields are required",
      });
    }

    // If isDefault = true, unset previous default
    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const address = await Address.create({
      userId,
      label,
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
    catch(error)
    {
         console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error adding address",
    });

    }
};

//  Get all addresses for a user
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: addresses.length,
      addresses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching addresses",
    });
  }
};

//  Update an address
exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const { label, street, city, pincode, state, country, isDefault } = req.body;

    let address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // If setting default, unset previous
    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    // Update fields
    if (label !== undefined) address.label = label;
    if (street !== undefined) address.street = street;
    if (city !== undefined) address.city = city;
    if (pincode !== undefined) address.pincode = pincode;
    if (state !== undefined) address.state = state;
    if (country !== undefined) address.country = country;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await address.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error updating address",
    });
  }
};

//  Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    const deleted = await Address.findOneAndDelete({ _id: addressId, userId });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
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