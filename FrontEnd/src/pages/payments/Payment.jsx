// src/pages/Payment.jsx

import React, { use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  FaCashRegister,
  FaSpinner,
  FaCheckCircle,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaClock,
  FaTruck
} from 'react-icons/fa';

import Confetti from 'react-confetti';

import './Payment.css';

import { useAddress } from '../../context/AddressContext';
import toast from 'react-hot-toast';
import api from '../../utils/Api';
import { useCart } from '../../context/CartContext';

const Payment = () => {

  const navigate = useNavigate();

  const { userAddress } = useAddress();
  const { clearCart} = useCart()
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [showConfetti, setShowConfetti] = useState(false);

  const [windowSize, setWindowSize] = useState({
    width:
      typeof window !== "undefined"
        ? window.innerWidth
        : 0,

    height:
      typeof window !== "undefined"
        ? window.innerHeight
        : 0,
  });

  // SAFE TOTAL
  const totalAmount =
    Number(localStorage.getItem("total")) || 0;

  // WINDOW RESIZE
  useEffect(() => {

    const handleResize = () => {

      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };

  }, []);

  // HANDLE BACK BUTTON
  const handleBack = () => {

    if (step === 2) {
      setStep(1);
      return;
    }

    navigate("/cart/checkout");

  };

  // HANDLE COD
  const handleCOD = async () => {

    try {

      setLoading(true);

      // SAFE CART ITEMS
      let cartItems = [];

      try {

        cartItems =
          JSON.parse(
            localStorage.getItem("cartItems")
          ) || [];

      } catch (err) {

        console.error(
          "Invalid cartItems JSON",
          err
        );

      }

      // CHECK EMPTY CART
      if (cartItems.length === 0) {

        toast.error("Your cart is empty");

        setLoading(false);

        return;

      }

      // SIMULATE API
 
      // CREATE ORDER
      const order = {

        id: Date.now(),

        orderId: `ORD${Math.floor(
          Math.random() * 1000000
        )}`,

        date: new Date().toISOString(),

        items: cartItems,

        total: totalAmount,

        address: userAddress,

        paymentMethod: "Cash on Delivery",

        status: "Confirmed",

        deliveryDate: new Date(
          Date.now() +
          7 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),

      };

      // // SAVE ORDER
      // const existingOrders =
      //   JSON.parse(
      //     localStorage.getItem("orders")
      //   ) || [];

      // existingOrders.push(order);

      // localStorage.setItem(
      //   "orders",
      //   JSON.stringify(existingOrders)
      // );

       const res = await api.post("/user/orders/create",{order})

       if(!res.data.success){
        throw new Error (
          res.data.message || "Order Failed"
        )
       }
       toast.success(res.data.message)

      // CLEAR CART
   clearCart();

   localStorage.removeItem("total");


      // SUCCESS
      setShowConfetti(true);

      setStep(3);

      // STOP LOADING
      setLoading(false);

      // STOP CONFETTI
      setTimeout(() => {

        setShowConfetti(false);

      }, 900);

    } catch (error) {

      console.error(error);

      setLoading(false);

      toast.error("Something went wrong");

    }

  };

  // GO TO ORDERS
  const handleGoToOrders = () => {

    navigate("/user/orders");

  };

  // STEP 1
  if (step === 1) {

    return (

      <div className="payment-container">

        <div className="payment-card glass-effect">

          <button
            className="back-button"
            onClick={handleBack}
          >
            <FaArrowLeft />
            Back
          </button>

          <h2 className="payment-title">

            <FaMapMarkerAlt className="title-icon" />

            Select Delivery Address

          </h2>

          {userAddress?.name ? (

            <div className="delivery-address-summary card-hover">

              <div className="address-content">

                <h3>{userAddress.name}</h3>

                <p className="address-line">
                  {userAddress.addressLine1}
                </p>

                <p className="address-location">
                  {userAddress.city},
                  {" "}
                  {userAddress.state}
                  {" "}
                  -
                  {" "}
                  {userAddress.pincode}
                </p>

                <p className="address-phone">
                  📞 {userAddress.phone}
                </p>

              </div>

              <button
                className="deliver-here-btn"
                onClick={() => setStep(2)}
              >
                Deliver to this Address

                <FaTruck className="btn-icon" />

              </button>

              <button
                className="change-address-btn"
                onClick={() =>
                  navigate("/user/address/add")
                }
              >
                Change Address
              </button>

            </div>

          ) : (

            <div className="no-address-card">

              <div className="empty-state">

                <FaMapMarkerAlt className="empty-icon" />

                <p>No saved address found</p>

                <button
                  className="add-address-btn"
                  onClick={() => (window.location.href = "/user/address/add")}
                    >
                  Add New Address
                </button>

              </div>

            </div>

          )}

        </div>

      </div>

    );

  }

  // STEP 2
  if (step === 2) {

    return (

      <div className="payment-container">

        <div className="payment-card glass-effect">

          <button
            className="back-button"
            onClick={handleBack}
          >
            <FaArrowLeft />
            Back
          </button>

          <h2 className="payment-title">
            Payment Method
          </h2>

          <div className="delivery-address-mini">

            <FaMapMarkerAlt className="mini-icon" />

            <div className="mini-address">

              <strong>
                {userAddress.name}
              </strong>

              <span>
                {userAddress.addressLine1},
                {" "}
                {userAddress.city}
              </span>

            </div>

          </div>

          <div className="payment-methods">

            {/* REMOVED onClick BUG */}

            <div className="payment-option selected card-hover">

              <div className="payment-option-left">

                <div className="payment-icon-wrapper">

                  <FaCashRegister className="payment-icon" />

                </div>

                <div>

                  <h3>Cash on Delivery</h3>

                  <p>
                    Pay when you receive your order
                  </p>

                </div>

              </div>

              <div className="payment-option-right">

                <div className="radio-btn selected">

                  <div className="radio-inner"></div>

                </div>

              </div>

            </div>

          </div>

          <div className="order-summary-payment">

            <div className="summary-header">
              <h4>Order Summary</h4>
            </div>

            <div className="summary-row">

              <span>Total Amount:</span>

              <span className="total-amount">

                <FaRupeeSign className="rupee-icon" />

                {totalAmount}

              </span>

            </div>

            <div className="summary-row">

              <span>Delivery Charges:</span>

              <span className="free">
                Free
              </span>

            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total-row">

              <span>To Pay:</span>

              <span className="grand-total">

                <FaRupeeSign className="rupee-icon" />

                {totalAmount}

              </span>

            </div>

            <p className="cod-note">

              <FaCheckCircle />

              No extra charges for Cash on Delivery

            </p>

          </div>

          <button
            onClick={handleCOD}
            className="place-order-btn"
            disabled={loading}
          >

            {loading ? (

              <>
                <FaSpinner className="spin" />
                Placing Order...
              </>

            ) : (

              <>
                Place Order
                {" "}
                (Cash on Delivery)
              </>

            )}

          </button>

        </div>

      </div>

    );

  }

  // STEP 3 SUCCESS
  return (

    <div className='confetti'>

      {showConfetti && (

   <Confetti
  width={windowSize.width}
  height={windowSize.height}

  numberOfPieces={500}

  recycle={true}

  gravity={1.2}

  initialVelocityX={{ min: -8, max: 8 }}

  initialVelocityY={{ min: 35, max: 80 }}

  tweenDuration={3000}

  friction={0.92}

  wind={0}

  colors={[
    "#ff0000",
    "#ff7300",
    "#fffb00",
    "#48ff00",
    "#00ffd5",
    "#0084ff",
    "#7a00ff",
    "#ff00c8",
    "#ffffff",
    "#ffd700"
  ]}

  confettiSource={{
    x: 0,
    y: 0,
    w: windowSize.width,
    h: 0
  }}
/>

      )}

      <div className="payment-container success-page">

        <div className="success-card premium-glass">

          <div className="celebration-animation">

            <div className="checkmark-circle">

              <div className="checkmark-bg"></div>

              <FaCheckCircle className="checkmark-icon" />

            </div>

          </div>

          <h2 className="success-title">
            Order Placed Successfully! 🎉
          </h2>

          <p className="success-message">
            Thank you for shopping with us
          </p>

          <div className="order-success-details premium-card">

            <div className="detail-item">

              <FaTruck className="detail-icon" />

              <div className="detail-content">

                <span className="detail-label">
                  Estimated Delivery
                </span>

                <span className="detail-value">

                  {new Date(
                    Date.now() +
                    7 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}

                </span>

              </div>

            </div>

            <div className="detail-item">

              <FaClock className="detail-icon" />

              <div className="detail-content">

                <span className="detail-label">
                  Order Status
                </span>

                <span className="detail-value status-badge">
                  Confirmed
                </span>

              </div>

            </div>

          </div>

          <div className="success-buttons">

            <button
              onClick={handleGoToOrders}
              className="view-orders-btn premium-btn"
            >
              View My Orders
            </button>

            <button
              onClick={() => navigate('/')}
              className="continue-shopping-btn premium-btn secondary"
            >
              Continue Shopping
            </button>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Payment;
