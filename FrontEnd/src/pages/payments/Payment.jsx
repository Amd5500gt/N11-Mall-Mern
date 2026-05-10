// src/pages/Payment.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCashRegister, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import './Payment.css';
import { useAddress } from '../../context/AddressContext';

const Payment = () => {

  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success
  const{ userAddress} = useAddress()

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const totalAmount = localStorage.getItem("total");

  const handleCOD = () => {
    setLoading(true);
    
    // Create order object
    const order = {
      id: Date.now(),
      orderId: `ORD${Math.floor(Math.random() * 1000000)}`,
      date: new Date().toISOString(),
      items: JSON.parse(localStorage.getItem('cartItems') || '[]'),
      total: totalAmount,
      address: userAddress,
      paymentMethod: 'Cash on Delivery',
      status: 'Pending',
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };

    // Get existing orders
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    // Clear cart
    localStorage.removeItem('cart');
    localStorage.removeItem('cartItems');
    
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 2000);
  };

  const handleGoToOrders = () => {
    navigate('/user/orders');
  };

if (step === 1) {

  return (

    <div className="payment-container">

      <div className="payment-card">

        <h2 className="payment-title">
          Select Delivery Address
        </h2>

        {userAddress?.name ? (

          <div className="delivery-address-summary">

            <h3>Saved Address</h3>

            <p>
              <strong>
                {userAddress.name}
              </strong>
            </p>

            <p>
              {userAddress.addressLine1}
            </p>

            <p>
              {userAddress.city},
              {" "}
              {userAddress.state}
              {" - "}
              {userAddress.pincode}
            </p>

            <p>
              Phone:
              {" "}
              {userAddress.phone}
            </p>

            <button
              className="place-order-btn"

              onClick={() => {
                setStep(2);
              }}
            >
              Deliver Here
            </button>

          </div>

        ) : (

          <div>

            <p>
              No saved address found
            </p>

            <button
              className="place-order-btn"

              onClick={() =>
                navigate(
                  "/user/address/add"
                )
              }
            >
              Add Address
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

  if (step === 2) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <h2 className="payment-title">Payment Method</h2>
          
          <div className="delivery-address-summary">
            <h3>Delivery Address</h3>
            <p><strong>{userAddress.name}</strong></p>
            <p>{userAddress.addressLine1}</p>
            <p>{userAddress.city}, {userAddress.state} - {userAddress.pincode}</p>
            <p>Phone: {userAddress.phone}</p>
          </div>

          <div className="payment-methods">
            <div className="payment-option selected" onClick={handleCOD}>
              <div className="payment-option-left">
                <FaCashRegister className="payment-icon" />
                <div>
                  <h3>Cash on Delivery</h3>
                  <p>Pay when you receive your order</p>
                </div>
              </div>
              <div className="payment-option-right">
                <div className="radio-btn selected"></div>
              </div>
            </div>
          </div>

          <div className="order-summary-payment">
            <div className="summary-row">
              <span>Total Amount:</span>
              <span className="total-amount">₹{totalAmount}</span>
            </div>
            <p className="cod-note">
              <FaCheckCircle /> No extra charges for Cash on Delivery
            </p>
          </div>

          <button 
            onClick={handleCOD} 
            className="place-order-btn"
            disabled={loading}
          >
            {loading ? (
              <>Placing Order <FaSpinner className="spin" /></>
            ) : (
              <>Place Order (Cash on Delivery)</>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="success-card">
        <div className="success-icon">
          <FaCheckCircle />
        </div>
        <h2>Order Placed Successfully! 🎉</h2>
        <p>Thank you for your order. Your items will be delivered soon.</p>
        <div className="order-success-details">
          <p>A confirmation has been sent to your registered email.</p>
          <p>You can track your order in the Orders section.</p>
        </div>
        <div className="success-buttons">
          <button onClick={handleGoToOrders} className="view-orders-btn">
            View My Orders
          </button>
          <button onClick={() => navigate('/')} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;