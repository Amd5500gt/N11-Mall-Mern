import React, {
  useState,
  useRef,
} from "react";

import "./AddressForm.css";

import BASE_URL from "../../../../config/config";

import toast from "react-hot-toast";

import { useSearch } from "../../../../context/SearchContext";

const AddressForm = ({ onSubmit }) => {

  const { token } = useSearch();

  const debounceRef = useRef(null);

  const [formData, setFormData] =
    useState({
      name: "",
      phone: "",
      addressLine1: "",
      city: "",
      state: "",
      pincode: "",
    });

  const [errors, setErrors] =
    useState({});

  const [suggestions, setSuggestions] =
    useState([]);

  /* VALIDATION */

  const validateForm = () => {

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        "Full name is required";
    }

    if (
      !/^\d{10}$/.test(
        formData.phone
      )
    ) {
      newErrors.phone =
        "Enter valid 10-digit number";
    }

    if (
      !formData.addressLine1.trim()
    ) {
      newErrors.addressLine1 =
        "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city =
        "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state =
        "State is required";
    }

    if (
      !/^\d{6}$/.test(
        formData.pincode
      )
    ) {
      newErrors.pincode =
        "Enter valid pincode";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  /* SUBMIT */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (!validateForm()) return;

      try {

        const res = await fetch(
          `${BASE_URL}/user/address/update`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify(
              formData
            ),
          }
        );

        const data =
          await res.json();

        if (!res.ok) {

          toast.error(
            data.message ||
              "Failed to save address"
          );

          return;
        }

        toast.success(
          "Address Saved Successfully"
        );

        if (onSubmit) {
          onSubmit(data.address);
        }

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
          "Something went wrong"
        );
      }
    };

  /* INPUT CHANGE */

  const handleChange = (e) => {

    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {

      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /* ADDRESS SEARCH */

  const handleAddressSearch =
    (value) => {

      handleChange({
        target: {
          name: "addressLine1",
          value,
        },
      });

      if (debounceRef.current) {
        clearTimeout(
          debounceRef.current
        );
      }

      if (value.length < 3) {
        setSuggestions([]);
        return;
      }

      debounceRef.current =
        setTimeout(
          async () => {

            try {

              const res =
                await fetch(
                  `https://nominatim.openstreetmap.org/search?format=json&q=${value}&countrycodes=in&limit=5`,
                  {
                    headers: {
                      Accept:
                        "application/json",
                    },
                  }
                );

              const data =
                await res.json();

              setSuggestions(data);

            } catch (err) {

              console.log(err);

              setSuggestions([]);
            }

          },
          400
        );
    };

  return (

    <form
      onSubmit={handleSubmit}
      className="address-form"
    >

      {/* NAME */}

      <div className="form-group">

        <label>Full Name *</label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter full name"
          autoComplete="name"
        />

        {errors.name && (
          <span className="error">
            {errors.name}
          </span>
        )}

      </div>

      {/* PHONE */}

      <div className="form-group">

        <label>
          Phone Number *
        </label>

        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter mobile number"
          autoComplete="tel"
        />

        {errors.phone && (
          <span className="error">
            {errors.phone}
          </span>
        )}

      </div>

      {/* ADDRESS */}

      <div className="form-group">

        <label>Address Line *</label>

        <input
          type="text"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={(e) =>
            handleAddressSearch(
              e.target.value
            )
          }
          placeholder="House No, Building"
          autoComplete="new-password"
        />

        {suggestions.length > 0 && (

          <div className="address-suggestions">

            {suggestions.map(
              (item) => (

                <div
                  key={item.place_id}

                  className="suggestion-item"

                  onClick={() => {

                    setFormData(
                      (prev) => ({
                        ...prev,
                        addressLine1:
                          item.display_name,
                      })
                    );

                    setSuggestions([]);
                  }}
                >
                  {item.display_name}
                </div>

              )
            )}

          </div>

        )}

        {errors.addressLine1 && (
          <span className="error">
            {errors.addressLine1}
          </span>
        )}

      </div>

      {/* CITY + STATE */}

      <div className="form-row">

        <div className="form-group">

          <label>City *</label>

          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            autoComplete="address-level2"
          />

          {errors.city && (
            <span className="error">
              {errors.city}
            </span>
          )}

        </div>

        <div className="form-group">

          <label>State *</label>

          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            autoComplete="address-level1"
          />

          {errors.state && (
            <span className="error">
              {errors.state}
            </span>
          )}

        </div>

      </div>

      {/* PINCODE */}

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
        />

        {errors.pincode && (
          <span className="error">
            {errors.pincode}
          </span>
        )}

      </div>

      {/* BUTTON */}

      <button
        type="submit"
        className="submit-address-btn"
      >
        Save Address
      </button>

    </form>
  );
};

export default AddressForm;