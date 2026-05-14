import React, { useState, useRef, useEffect } from "react";
import "./AddressForm.css";
import toast from "react-hot-toast";
import api from "../../../../utils/Api";
import { useNavigate } from "react-router-dom";

const AddressForm = ({ onSubmit }) => {
  // Debounce reference
  const debounceRef = useRef(null);
  const navigate = useNavigate()
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Error state
  const [errors, setErrors] = useState({});
  
  // Suggestions state
  const [suggestions, setSuggestions] = useState([]);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter valid 10-digit number";
    }

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Enter valid pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Address search with debounce
  const handleAddressSearch = (value) => {
    handleChange({
      target: { name: "addressLine1", value },
    });

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Don't search for short values
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    // Debounce API call
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${value}&countrycodes=in&limit=5`,
          { headers: { Accept: "application/json" } }
        );
        
        const data = await res.json();
        setSuggestions(data || []);
      } catch (err) {
        console.log(err);
        setSuggestions([]);
      }
    }, 400);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await api.post("/user/address/update", formData);
      const data = res.data;

      
      // Callback to parent
      if (onSubmit) {
        onSubmit(data.address);
      }
      toast.success(data.message || "Address Saved");
      navigate(-1)

      // Reset form
      setFormData({
        name: "",
        phone: "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: "",
      });
      setSuggestions([]);
      setErrors({});
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message || err.message || "Failed to save address"
      );
    }
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="address-form">
      {/* Full Name */}
      <div className="form-group">
        <label>Full Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter full name"
          autoComplete="name"
          className={errors.name ? "error-input" : ""}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      {/* Phone Number */}
      <div className="form-group">
        <label>Phone Number *</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter mobile number"
          autoComplete="tel"
          className={errors.phone ? "error-input" : ""}
        />
        {errors.phone && <span className="error">{errors.phone}</span>}
      </div>

      {/* Address Line */}
      <div className="form-group">
        <label>Address Line *</label>
        <input
          type="text"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={(e) => handleAddressSearch(e.target.value)}
          placeholder="House No, Building, Street"
          autoComplete="off"
          className={errors.addressLine1 ? "error-input" : ""}
        />

        {/* Address Suggestions */}
        {suggestions.length > 0 && (
          <div className="address-suggestions">
            {suggestions.map((item) => (
              <div
                key={item.place_id}
                className="suggestion-item"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    addressLine1: item.display_name,
                  }));
                  setSuggestions([]);
                }}
              >
                {item.display_name}
              </div>
            ))}
          </div>
        )}

        {errors.addressLine1 && (
          <span className="error">{errors.addressLine1}</span>
        )}
      </div>

      {/* City and State Row */}
      <div className="form-row">
        {/* City */}
        <div className="form-group">
          <label>City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            autoComplete="address-level2"
            className={errors.city ? "error-input" : ""}
          />
          {errors.city && <span className="error">{errors.city}</span>}
        </div>

        {/* State */}
        <div className="form-group">
          <label>State *</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            autoComplete="address-level1"
            className={errors.state ? "error-input" : ""}
          />
          {errors.state && <span className="error">{errors.state}</span>}
        </div>
      </div>

      {/* Pincode */}
      <div className="form-group">
        <label>Pincode *</label>
        <input
          type="text"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          placeholder="Pincode"
          maxLength={6}
          autoComplete="postal-code"
          className={errors.pincode ? "error-input" : ""}
        />
        {errors.pincode && <span className="error">{errors.pincode}</span>}
      </div>

      {/* Submit Button */}
      <button type="submit" className="submit-address-btn">
        Save Address
      </button>
    </form>
  );
};

export default AddressForm;