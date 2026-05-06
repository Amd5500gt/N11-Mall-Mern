// components/AddressModal.jsx
import React, { useState } from 'react';
import { FiX, FiEdit2, FiTrash2, FiPlus, FiMapPin, FiCheck } from 'react-icons/fi';
import { BsCheck } from 'react-icons/bs';
import toast from 'react-hot-toast';

const AddressModal = ({ token, addresses, onClose, onAddressChange }) => {
  const [editingAddress, setEditingAddress] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [defaultLoading, setDefaultLoading] = useState(null);

  const validateForm = () => {
    if (!addressForm.street.trim()) {
      toast.error('Street address is required');
      return false;
    }
    if (!addressForm.city.trim()) {
      toast.error('City is required');
      return false;
    }
    if (!addressForm.state.trim()) {
      toast.error('State is required');
      return false;
    }
    if (!addressForm.pincode.trim()) {
      toast.error('Pincode is required');
      return false;
    }
    if (!/^\d{6}$/.test(addressForm.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      let response;
      const url = editingAddress 
        ? `http://localhost:8080/api/address/${editingAddress._id}`
        : 'http://localhost:8080/api/address';
      
      const method = editingAddress ? 'PUT' : 'POST';

      response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addressForm)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(editingAddress ? 'Address updated successfully!' : 'Address added successfully!');
        resetForm();
        if (onAddressChange) {
          await onAddressChange();
        }
      } else {
        throw new Error(data.message || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      
      // Fallback to localStorage if API fails
      if (error.message === 'Failed to fetch') {
        const localAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
        
        if (editingAddress) {
          const updatedAddresses = localAddresses.map(addr => 
            (addr._id === editingAddress._id || addr.id === editingAddress.id)
              ? { ...addr, ...addressForm, updatedAt: new Date().toISOString() }
              : addr
          );
          localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
          toast.success('Address updated locally!');
        } else {
          const newAddress = {
            ...addressForm,
            _id: Date.now().toString(),
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
          };
          localAddresses.push(newAddress);
          localStorage.setItem('userAddresses', JSON.stringify(localAddresses));
          toast.success('Address saved locally!');
        }
        
        resetForm();
        if (onAddressChange) {
          await onAddressChange();
        }
      } else {
        toast.error(error.message || 'Failed to save address');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    setDeleteLoading(addressId);
    
    try {
      const response = await fetch(`http://localhost:8080/api/address/${addressId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Address deleted successfully!');
        if (onAddressChange) {
          await onAddressChange();
        }
      } else {
        throw new Error(data.message || 'Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      console.log("addresses:", addresses);
      // Fallback to localStorage
      if (error.message === 'Failed to fetch') {
        const localAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
        const updatedAddresses = localAddresses.filter(addr => 
          (addr._id !== addressId && addr.id !== addressId)
        );
        localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
        toast.success('Address deleted locally!');
        if (onAddressChange) {
          await onAddressChange();
        }
      } else {
        toast.error('Failed to delete address');
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleSetDefault = async (addressId) => {
    setDefaultLoading(addressId);
    
    try {
      const response = await fetch(`http://localhost:8080/api/address/${addressId}/default`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Default address updated!');
        if (onAddressChange) {
          await onAddressChange();
        }
      } else {
        throw new Error(data.message || 'Failed to set default address');
      }
    } catch (error) {
      console.error('Error setting default:', error);
      
      // Fallback to localStorage
      if (error.message === 'Failed to fetch') {
        const localAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
        const updatedAddresses = localAddresses.map(addr => ({
          ...addr,
          isDefault: (addr._id === addressId || addr.id === addressId)
        }));
        localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
        toast.success('Default address updated locally!');
        if (onAddressChange) {
          await onAddressChange();
        }
      } else {
        toast.error('Failed to set default address');
      }
    } finally {
      setDefaultLoading(null);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setAddressForm({
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      isDefault: address.isDefault || false
    });
    setIsAddingNew(true);
    
    // Scroll to form
    setTimeout(() => {
      document.querySelector('.address-form-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setEditingAddress(null);
    setIsAddingNew(false);
    setAddressForm({
      street: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setAddressForm({
      street: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
    setIsAddingNew(true);
    
    // Scroll to form
    setTimeout(() => {
      document.querySelector('.address-form-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="address-panel">
        {/* Header */}
        <div className="panel-header">
          <div className="panel-title">
            <FiMapPin size={24} className="panel-icon" />
            <h2>My Addresses</h2>
          </div>
          <button className="close-panel-btn" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {/* Address List */}
        <div className="address-list-section">
          {!addresses || addresses.length === 0 ? (
            <div className="empty-state">
              <FiMapPin size={64} />
              <h3>No addresses saved yet</h3>
              <p>Add your first address for faster checkout experience</p>
              <button className="add-first-address-btn" onClick={handleAddNew}>
                <FiPlus size={18} />
                Add Your First Address
              </button>
            </div>
          ) : (
            <>
              <div className="address-count-info">
                {addresses.length} {addresses.length === 1 ? 'address' : 'addresses'} saved
              </div>
              {addresses.map((address) => (
                <div 
                  key={address._id || address.id} 
                  className={`address-card ${address.isDefault ? 'default' : ''}`}
                >
                  {address.isDefault && (
                    <span className="default-badge">
                      <BsCheck /> Default
                    </span>
                  )}
                  
                  <div className="address-content">
                    <div className="address-icon">
                      <FiMapPin size={20} />
                    </div>
                    <div className="address-text">
                      <p className="address-street">{address.street}</p>
                      <p className="address-location">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="address-card-actions">
                    {!address.isDefault && (
                      <button
                        className="set-default-btn"
                        onClick={() => handleSetDefault(address._id || address.id)}
                        disabled={defaultLoading === (address._id || address.id)}
                        title="Set as default"
                      >
                        {defaultLoading === (address._id || address.id) ? (
                          <span className="btn-spinner"></span>
                        ) : (
                          <>
                            <FiCheck size={14} />
                            Set as Default
                          </>
                        )}
                      </button>
                    )}
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(address)}
                      title="Edit address"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(address._id || address.id)}
                      disabled={deleteLoading === (address._id || address.id)}
                      title="Delete address"
                    >
                      {deleteLoading === (address._id || address.id) ? (
                        <span className="btn-spinner-small"></span>
                      ) : (
                        <FiTrash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Add/Edit Form */}
        {isAddingNew ? (
          <div className="address-form-section">
            <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="street">Street Address *</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={addressForm.street}
                  onChange={handleInputChange}
                  placeholder="Enter complete street address"
                  required
                  autoFocus
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={addressForm.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={addressForm.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pincode">Pincode *</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={addressForm.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit pincode"
                    pattern="[0-9]{6}"
                    maxLength="6"
                    required
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={addressForm.isDefault}
                      onChange={handleInputChange}
                    />
                    <span>Set as default address</span>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="save-btn" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="btn-spinner"></span>
                      Saving...
                    </>
                  ) : editingAddress ? (
                    'Update Address'
                  ) : (
                    'Save Address'
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="add-address-section">
            <button className="add-address-btn" onClick={handleAddNew}>
              <FiPlus size={20} />
              Add New Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressModal;