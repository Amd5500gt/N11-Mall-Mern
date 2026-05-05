const {  userAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  setDefaultAddress,
  removeAddress,
  deleteAllAddresses} = require("../Controllors/AddressAPI");
const authCart = require("../Middlewares/authCart");

// routes/addressRoutes.js
const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../Middlewares/verifiyToken');

// All routes are protected with authentication
router.use(authenticateToken);

// Get all addresses
router.get('/', getAddresses);

// Get single address
router.get('/:id', getAddressById);

// Add new address
router.post('/', userAddress);

// Update address
router.put('/:id', updateAddress);

// Set address as default
router.patch('/:id/default', setDefaultAddress);

// Delete address
router.delete('/:id', removeAddress);

// Delete all addresses
router.delete('/', deleteAllAddresses);

module.exports = router;