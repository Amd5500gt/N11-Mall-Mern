import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AddressForm from "../addressForm/AddressForm";
import "./AddressPage.css";
import { useAddress } from "../../../../context/AddressContext";

const Addresses = () => {
  const { userAddress, setUserAddress } = useAddress();
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddressSubmit = async (newAddress) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUserAddress(newAddress);
      setShowForm(false);
      
      toast.success("Address saved successfully!", {
        icon: "✅",
        duration: 3000,
        style: {
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "white",
          borderRadius: "12px",
        },
      });
    } catch (error) {
      toast.error("Failed to save address", {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    setShowForm(!showForm);
    if (!showForm && userAddress) {
      toast("You can edit your address below", {
        icon: "✏️",
        duration: 2000,
      });
    }
  };

  return (
    <div className="address-page-container">
      {/* HEADER */}
      <div className="address-page-header">
        <div>
          <h1>My Addresses</h1>
          <p>Manage your delivery addresses easily</p>
        </div>

        <button
          className="address-btn"
          onClick={handleEditClick}
        >
          {showForm 
            ? "Cancel Edit" 
            : userAddress?.name 
              ? "Edit Address" 
              : "Add Address"
          }
        </button>
      </div>

      {/* ADDRESS CARD */}
      {!showForm && (
        <>
          {userAddress?.name ? (
            <div className="address-wrapper">
              <div className="address-model-box">
                <div className="glow-effect"></div>
                
                <div className="address-top">
                  <span className="address-badge">
                    ⭐ Default Address
                  </span>
                </div>

                <div className="address-content">
                  {/* LEFT COLUMN */}
                  <div className="left-side">
                    <div className="address-field">
                      <label>Full Name</label>
                      <span>{userAddress.name}</span>
                    </div>

                    <div className="address-field">
                      <label>Phone Number</label>
                      <span>{userAddress.phone}</span>
                    </div>

                    <div className="address-field">
                      <label>Pincode</label>
                      <span>{userAddress.pincode}</span>
                    </div>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="right-side">
                    <div className="address-field">
                      <label>Address</label>
                      <span>{userAddress.addressLine1}</span>
                    </div>

                    <div className="address-field">
                      <label>City</label>
                      <span>{userAddress.city}</span>
                    </div>

                    <div className="address-field">
                      <label>State</label>
                      <span>{userAddress.state}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-address-box">
              <div className="empty-icon">📍</div>
              <h3>No Address Found</h3>
              <p>Add your first delivery address to continue shopping</p>
            </div>
          )}
        </>
      )}

      {/* FORM SECTION */}
      {showForm && (
        <div className="address-form-section">
          <AddressForm
            onSubmit={handleAddressSubmit}
            initialData={userAddress}
          />
        </div>
      )}

      {/* LOADING OVERLAY */}
      {isLoading && (
        <div className="address-loading">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default Addresses;