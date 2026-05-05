const userModel = require("../Models/userModel");

// Add new address
const userAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { street, city, state, pincode, isDefault } = req.body;

    // Validation
    if (!street || !city || !state || !pincode) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required: street, city, state, pincode" 
      });
    }

    // Validate pincode
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid pincode. Must be 6 digits" 
      });
    }

    const newAddress = {
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      isDefault: isDefault || false,
      createdAt: new Date()
    };

    // If this is set as default, remove default from other addresses
    if (newAddress.isDefault) {
      await userModel.findByIdAndUpdate(userId, {
        $set: { "addresses.$[].isDefault": false }
      });
    }

    // If this is the first address, make it default automatically
    const user = await userModel.findById(userId);
    if (!user.addresses || user.addresses.length === 0) {
      newAddress.isDefault = true;
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $push: { addresses: newAddress } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      addresses: updatedUser.addresses,
      newAddress: updatedUser.addresses[updatedUser.addresses.length - 1]
    });

  } catch (err) {
    console.error("Error adding address:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Get all addresses
const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await userModel.findById(userId).select('addresses');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    res.status(200).json({
      success: true,
      addresses: user.addresses || []
    });

  } catch (err) {
    console.error("Error fetching addresses:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Get single address
const getAddressById = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const user = await userModel.findOne(
      { _id: userId, "addresses._id": addressId },
      { "addresses.$": 1 }
    );

    if (!user || !user.addresses || user.addresses.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Address not found" 
      });
    }

    res.status(200).json({
      success: true,
      address: user.addresses[0]
    });

  } catch (err) {
    console.error("Error fetching address:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Update address
const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;
    const { street, city, state, pincode, isDefault } = req.body;

    // Check if address exists
    const existingUser = await userModel.findOne({
      _id: userId,
      "addresses._id": addressId
    });

    if (!existingUser) {
      return res.status(404).json({ 
        success: false,
        message: "Address not found" 
      });
    }

    // Validate if fields are provided
    if (pincode && !/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid pincode. Must be 6 digits" 
      });
    }

    // Build update object dynamically
    const updateFields = {};
    if (street) updateFields["addresses.$.street"] = street.trim();
    if (city) updateFields["addresses.$.city"] = city.trim();
    if (state) updateFields["addresses.$.state"] = state.trim();
    if (pincode) updateFields["addresses.$.pincode"] = pincode.trim();
    
    // Handle default address logic
    if (isDefault === true) {
      // Remove default from all other addresses first
      await userModel.findByIdAndUpdate(userId, {
        $set: { "addresses.$[].isDefault": false }
      });
      updateFields["addresses.$.isDefault"] = true;
    }

    updateFields["addresses.$.updatedAt"] = new Date();

    const updatedUser = await userModel.findOneAndUpdate(
      {
        _id: userId,
        "addresses._id": addressId
      },
      {
        $set: updateFields
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      addresses: updatedUser.addresses
    });

  } catch (err) {
    console.error("Error updating address:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Set address as default
const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    // Check if address exists
    const existingUser = await userModel.findOne({
      _id: userId,
      "addresses._id": addressId
    });

    if (!existingUser) {
      return res.status(404).json({ 
        success: false,
        message: "Address not found" 
      });
    }

    // Remove default from all addresses
    await userModel.findByIdAndUpdate(userId, {
      $set: { "addresses.$[].isDefault": false }
    });

    // Set the selected address as default
    const updatedUser = await userModel.findOneAndUpdate(
      {
        _id: userId,
        "addresses._id": addressId
      },
      {
        $set: { "addresses.$.isDefault": true }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      addresses: updatedUser.addresses
    });

  } catch (err) {
    console.error("Error setting default address:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};


// Remove address
const removeAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    // Check if address exists
    const existingUser = await userModel.findOne({
      _id: userId,
      "addresses._id": addressId
    });

    if (!existingUser) {
      return res.status(404).json({ 
        success: false,
        message: "Address not found" 
      });
    }

    // Check if trying to delete the only address
    if (existingUser.addresses.length === 1) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete the only address. Add another address first."
      });
    }

    // Check if deleting default address
    const addressToDelete = existingUser.addresses.find(
      addr => addr._id.toString() === addressId
    );

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        $pull: {
          addresses: { _id: addressId }
        }
      },
      { new: true }
    );

    // If deleted address was default, set first remaining address as default
    if (addressToDelete && addressToDelete.isDefault && updatedUser.addresses.length > 0) {
      await userModel.findByIdAndUpdate(
        userId,
        { $set: { "addresses.0.isDefault": true } }
      );
      
      // Fetch updated addresses
      const finalUser = await userModel.findById(userId).select('addresses');
      
      return res.status(200).json({
        success: true,
        message: "Address deleted. New default address set.",
        addresses: finalUser.addresses
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      addresses: updatedUser.addresses
    });

  } catch (err) {
    console.error("Error removing address:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Delete all addresses (optional - use with caution)
const deleteAllAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: { addresses: [] } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "All addresses deleted successfully",
      addresses: []
    });

  } catch (err) {
    console.error("Error deleting all addresses:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

module.exports = {
  userAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  setDefaultAddress,
  removeAddress,
  deleteAllAddresses
};