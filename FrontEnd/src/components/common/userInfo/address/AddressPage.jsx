import React, {useState} from "react";

import {
  useSearch
} from "../../../../context/SearchContext";

import toast from "react-hot-toast";
import AddressForm from "../addressForm/AddressForm";
import "./AddressPage.css";

const Addresses = () => {

 const  {userAddress,setUserAddress} = useAddress()
  const [showForm, setShowForm] =
  useState(false);
  const handleAddressSubmit =
  (newAddress) => {

    setUserAddress(newAddress);

    setShowForm(false);

    toast.success(
      "Address saved successfully"
    );
  };

  return (

    <div className="
    address-page-container
    ">

      {/* HEADER */}

      <div className="
      address-page-header
      ">

        <div>

          <h1>
            My Addresses
          </h1>

          <p>
            Manage your delivery
            addresses easily
          </p>

        </div>

        {
          userAddress?.name ? (

            <button
              className="
              address-btn
              "
              onClick={() =>
                setShowForm(!showForm)
              }
            >
              {
                showForm
                ? "Close Form"
                : "Change Address"
              }
            </button>

          ) : (

            <button
              className="
              address-btn
              "
              onClick={() =>
                setShowForm(!showForm)
              }
            >
              Add Address
            </button>

          )
        }

      </div>

      {/* ADDRESS CARD */}

    {
  !showForm && (

    userAddress?.name ? (

      <div className="
      address-wrapper
      ">

        <div className="
        address-model-box
        ">

          <div className="
          glow-effect
          "></div>

          <div className="
          address-top
          ">

            <span className="
            address-badge
            ">

              Default Address

            </span>

          </div>

          <div className="
          address-content
          ">

            {/* LEFT */}

            <div className="
            left-side
            ">

              <div className="
              address-field
              ">

                <label>
                  Full Name
                </label>

                <span>
                  {userAddress.name}
                </span>

              </div>

              <div className="
              address-field
              ">

                <label>
                  Phone
                </label>

                <span>
                  {userAddress.phone}
                </span>

              </div>

              <div className="
              address-field
              ">

                <label>
                  Pincode
                </label>

                <span>
                  {userAddress.pincode}
                </span>

              </div>

            </div>

            {/* RIGHT */}

            <div className="
            right-side
            ">

              <div className="
              address-field
              ">

                <label>
                  Address
                </label>

                <span>
                  {
                    userAddress
                    .addressLine1
                  }
                </span>

              </div>

              <div className="
              address-field
              ">

                <label>
                  City
                </label>

                <span>
                  {userAddress.city}
                </span>

              </div>

              <div className="
              address-field
              ">

                <label>
                  State
                </label>

                <span>
                  {userAddress.state}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    ) : (

      <div className="
      no-address-box
      ">

        <div className="
        empty-icon
        ">
          📍
        </div>

        <h3>
          No Address Found
        </h3>

        <p>
          Add your first
          delivery address
          to continue
        </p>

      </div>

    )

  )
}
{/* FORM */}

{
  showForm && (

    <div className="
    address-form-section
    ">

      <AddressForm
        onSubmit={
          handleAddressSubmit
        }
      />

    </div>

  )
}
    </div>
  );
};

export default Addresses;