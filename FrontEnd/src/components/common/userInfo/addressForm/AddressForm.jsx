import React,{
  useState,
  useRef,
  useEffect
}
from "react";

import "./AddressForm.css";

import toast
from "react-hot-toast";

import api
from "../../../../utils/Api";

const AddressForm =
({ onSubmit }) => {

  /* DEBOUNCE */

  const debounceRef =
  useRef(null);

  /* FORM */

  const [
    formData,
    setFormData
  ] = useState({

    name:"",
    phone:"",
    addressLine1:"",
    city:"",
    state:"",
    pincode:"",

  });

  /* ERRORS */

  const [errors,
    setErrors] =
    useState({});

  /* SUGGESTIONS */

  const [

    suggestions,
    setSuggestions

  ] = useState([]);

  /* VALIDATE */

  const validateForm =
  () => {

    const newErrors = {};

    if (
      !formData.name.trim()
    ) {

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
      !formData.addressLine1
      .trim()
    ) {

      newErrors.addressLine1 =
      "Address is required";

    }

    if (
      !formData.city.trim()
    ) {

      newErrors.city =
      "City is required";

    }

    if (
      !formData.state.trim()
    ) {

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
      Object.keys(
        newErrors
      ).length === 0
    );

  };

  /* SUBMIT */

  const handleSubmit =
  async (e) => {

    e.preventDefault();

    if (
      !validateForm()
    ) return;

    try {

      const res =
      await api.post(
        "/user/address/update",
        formData
      );

      const data =
      res.data;

      toast.success(

        data.message ||

        "Address Saved"

      );

      /* CALLBACK */

      if (onSubmit) {

        onSubmit(
          data.address
        );

      }

      /* RESET */

      setFormData({

        name:"",
        phone:"",
        addressLine1:"",
        city:"",
        state:"",
        pincode:"",

      });

      setSuggestions([]);

      setErrors({});

    }

    catch (err) {

      console.log(err);

      toast.error(

        err.response?.data?.message ||

        err.message ||

        "Failed to save address"

      );

    }

  };

  /* INPUT */

  const handleChange =
  (e) => {

    const {
      name,
      value
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:value
    }));

    /* CLEAR ERROR */

    if (errors[name]) {

      setErrors((prev) => ({
        ...prev,
        [name]:""
      }));

    }

  };

  /* SEARCH ADDRESS */

  const handleAddressSearch =
  (value) => {

    handleChange({

      target:{

        name:"addressLine1",
        value

      }

    });

    /* CLEAR OLD */

    if (
      debounceRef.current
    ) {

      clearTimeout(
        debounceRef.current
      );

    }

    /* SHORT VALUE */

    if (
      value.length < 3
    ) {

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

              headers:{
                Accept:
                "application/json"
              }

            }

          );

          const data =
          await res.json();

          setSuggestions(
            data || []
          );

        }

        catch (err) {

          console.log(err);

          setSuggestions([]);

        }

      },

      400

    );

  };

  /* CLEANUP */

  useEffect(() => {

    return () => {

      if (
        debounceRef.current
      ) {

        clearTimeout(
          debounceRef.current
        );

      }

    };

  }, []);

  return (

    <form

      onSubmit={
        handleSubmit
      }

      className=
      "address-form"

    >

      {/* NAME */}

      <div className=
      "form-group">

        <label>

          Full Name *

        </label>

        <input

          type="text"

          name="name"

          value={
            formData.name
          }

          onChange={
            handleChange
          }

          placeholder=
          "Enter full name"

          autoComplete=
          "name"

        />

        {
          errors.name && (

            <span className=
            "error">

              {errors.name}

            </span>

          )
        }

      </div>

      {/* PHONE */}

      <div className=
      "form-group">

        <label>

          Phone Number *

        </label>

        <input

          type="tel"

          name="phone"

          value={
            formData.phone
          }

          onChange={
            handleChange
          }

          placeholder=
          "Enter mobile number"

          autoComplete=
          "tel"

        />

        {
          errors.phone && (

            <span className=
            "error">

              {errors.phone}

            </span>

          )
        }

      </div>

      {/* ADDRESS */}

      <div className=
      "form-group">

        <label>

          Address Line *

        </label>

        <input

          type="text"

          name="addressLine1"

          value={
            formData.addressLine1
          }

          onChange={(e) =>

            handleAddressSearch(
              e.target.value
            )

          }

          placeholder=
          "House No, Building"

          autoComplete=
          "new-password"

        />

        {/* SUGGESTIONS */}

        {
          suggestions.length > 0 && (

            <div className=
            "address-suggestions">

              {
                suggestions.map(
                  (item) => (

                    <div

                      key={
                        item.place_id
                      }

                      className=
                      "suggestion-item"

                      onClick={() => {

                        setFormData(
                          (prev) => ({
                            ...prev,

                            addressLine1:
                            item.display_name
                          })
                        );

                        setSuggestions([]);

                      }}

                    >

                      {
                        item.display_name
                      }

                    </div>

                  )
                )
              }

            </div>

          )
        }

        {
          errors.addressLine1 && (

            <span className=
            "error">

              {
                errors.addressLine1
              }

            </span>

          )
        }

      </div>

      {/* CITY STATE */}

      <div className=
      "form-row">

        {/* CITY */}

        <div className=
        "form-group">

          <label>

            City *

          </label>

          <input

            type="text"

            name="city"

            value={
              formData.city
            }

            onChange={
              handleChange
            }

            placeholder=
            "City"

            autoComplete=
            "address-level2"

          />

          {
            errors.city && (

              <span className=
              "error">

                {errors.city}

              </span>

            )
          }

        </div>

        {/* STATE */}

        <div className=
        "form-group">

          <label>

            State *

          </label>

          <input

            type="text"

            name="state"

            value={
              formData.state
            }

            onChange={
              handleChange
            }

            placeholder=
            "State"

            autoComplete=
            "address-level1"

          />

          {
            errors.state && (

              <span className=
              "error">

                {errors.state}

              </span>

            )
          }

        </div>

      </div>

      {/* PINCODE */}

      <div className=
      "form-group">

        <label>

          Pincode *

        </label>

        <input

          type="text"

          name="pincode"

          value={
            formData.pincode
          }

          onChange={
            handleChange
          }

          placeholder=
          "Pincode"

          maxLength={6}

          autoComplete=
          "postal-code"

        />

        {
          errors.pincode && (

            <span className=
            "error">

              {errors.pincode}

            </span>

          )
        }

      </div>

      {/* BUTTON */}

      <button

        type="submit"

        className=
        "submit-address-btn"

      >

        Save Address

      </button>

    </form>

  );

};

export default AddressForm;