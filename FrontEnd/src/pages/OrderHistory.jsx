// src/pages/OrderHistory.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaCalendar, FaRupeeSign, FaMapMarkerAlt, FaEye } from 'react-icons/fa';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    // Sort orders by date (newest first)
    savedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    setOrders(savedOrders);
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending':
        return <span className="status-badge pending">Pending</span>;
      case 'Confirmed':
        return <span className="status-badge confirmed">Confirmed</span>;
      case 'Shipped':
        return <span className="status-badge shipped">Shipped</span>;
      case 'Delivered':
        return <span className="status-badge delivered">Delivered</span>;
      case 'Cancelled':
        return <span className="status-badge cancelled">Cancelled</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (orders.length === 0) {
    return (
      <div className="orders-container">
        <div className="empty-orders">
          <FaBox className="empty-icon" />
          <h2>No Orders Yet</h2>
          <p>Looks like you haven't placed any orders yet.</p>
          <Link to="/" className="start-shopping-btn">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>{orders.length} {orders.length === 1 ? 'order' : 'orders'} placed</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <div className="order-id">
                  <strong>Order #{order.orderId}</strong>
                </div>
                <div className="order-date">
                  <FaCalendar />
                  <span>{formatDate(order.date)}</span>
                </div>
              </div>
              {getStatusBadge(order.status)}
            </div>

            <div className="order-items-preview">
              {order.items.slice(0, 3).map((item, idx) => (
                <div key={idx} className="order-item-preview">
                  <img src={item.thumbnail} alt={item.title} />
                  <div className="item-preview-info">
                    <span>{item.title}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="more-items">
                  +{order.items.length - 3} more items
                </div>
              )}
            </div>

            <div className="order-footer">
              <div className="order-total">
                <FaRupeeSign />
                <span>Total: ₹{order.total}</span>
              </div>
              <div className="order-payment">
                <span>Payment: {order.paymentMethod}</span>
              </div>
              <button 
                className="view-details-btn"
                onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
              >
                <FaEye /> {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
              </button>
            </div>

            {selectedOrder?.id === order.id && (
              <div className="order-details-expanded">
                <div className="delivery-address">
                  <h4><FaMapMarkerAlt /> Delivery Address</h4>
                  <p><strong>{order.address.fullName}</strong></p>
                  <p>{order.address.addressLine1}</p>
                  {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                  <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                  <p>Phone: {order.address.phone}</p>
                </div>

                <div className="all-order-items">
                  <h4>Order Items</h4>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item-full">
                      <img src={item.thumbnail} alt={item.title} />
                      <div className="order-item-details">
                        <h5>{item.title}</h5>
                        <p>Brand: {item.brand}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ₹{(item.price * 20).toFixed(2)} each</p>
                        <p className="item-subtotal">
                          Subtotal: ₹{(item.price * 20 * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {order.status === 'Delivered' && (
                  <div className="order-review">
                    <button className="review-btn">Write a Review</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;