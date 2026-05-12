// src/pages/OrderHistory.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaBox, FaCalendar, FaRupeeSign, FaMapMarkerAlt, FaEye, 
  FaChevronDown, FaChevronUp, FaTruck, FaCheckCircle, 
  FaClock, FaShoppingBag, FaStar, FaFilter, FaSearch,
  FaDownload, FaPrint, FaExternalLinkAlt
} from 'react-icons/fa';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const navigate = useNavigate()
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    pending: 0,
    cancelled: 0
  });

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const sortedOrders = savedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    setOrders(sortedOrders);
    setFilteredOrders(sortedOrders);
    calculateStats(sortedOrders);
  }, []);

  useEffect(() => {
    filterOrders();
  }, [filterStatus, searchTerm, orders]);

  const calculateStats = (ordersList) => {
    const total = ordersList.length;
    const delivered = ordersList.filter(o => o.status === 'Delivered').length;
    const pending = ordersList.filter(o => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Shipped').length;
    const cancelled = ordersList.filter(o => o.status === 'Cancelled').length;
    
    setStats({ total, delivered, pending, cancelled });
  };

  const filterOrders = () => {
    let filtered = [...orders];
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredOrders(filtered);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { class: 'oh-status-pending', icon: <FaClock />, text: 'Pending' },
      'Confirmed': { class: 'oh-status-confirmed', icon: <FaCheckCircle />, text: 'Confirmed' },
      'Shipped': { class: 'oh-status-shipped', icon: <FaTruck />, text: 'Shipped' },
      'Delivered': { class: 'oh-status-delivered', icon: <FaCheckCircle />, text: 'Delivered' },
      'Cancelled': { class: 'oh-status-cancelled', icon: <FaBox />, text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig['Pending'];
    
    return (
      <span className={`oh-status-badge ${config.class}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const getProgressSteps = (status) => {
    const steps = ['Order Placed', 'Confirmed', 'Shipped', 'Delivered'];
    let currentStep = 0;
    
    switch(status) {
      case 'Confirmed': currentStep = 1; break;
      case 'Shipped': currentStep = 2; break;
      case 'Delivered': currentStep = 3; break;
      default: currentStep = 0;
    }
    
    return (
      <div className="oh-order-progress">
        {steps.map((step, index) => (
          <div key={index} className={`oh-progress-step ${index <= currentStep ? 'oh-active' : ''}`}>
            <div className="oh-progress-dot"></div>
            <span>{step}</span>
          </div>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handlePrint = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Order ${order.orderId}</title></head>
        <body>${generateOrderHTML(order)}</body>
      </html>
    `);
    printWindow.print();
  };

  const generateOrderHTML = (order) => {
    return `
      <div style="padding: 20px; font-family: Arial;">
        <h2>Order Details - ${order.orderId}</h2>
        <p>Date: ${formatDate(order.date)}</p>
        <h3>Items</h3>
        ${order.items.map(item => {
          const itemUnitRupee = Number(item.price || 0) * (1 - (Number(item.discountPercentage || 0) / 100)) * 20;
          return `
          <div>
            <p>${item.title} - Qty: ${item.quantity} - ${formatPrice(itemUnitRupee)}</p>
          </div>
        `}).join('')}
        <h3>Total: ${formatPrice(order.total)}</h3>
        <h3>Delivery Address</h3>
        <p>${order.address.fullName}</p>
        <p>${order.address.addressLine1}</p>
        <p>${order.address.city}, ${order.address.state} - ${order.address.pincode}</p>
      </div>
    `;
  };

  if (orders.length === 0) {
    return (
      <div className="oh-orders-container">
        <div className="oh-empty-orders oh-glass-effect">
          <div className="oh-empty-animation">
            <FaShoppingBag className="oh-empty-icon" />
            <div className="oh-empty-particles">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`oh-empty-particle oh-empty-particle-${i}`}></div>
              ))}
            </div>
          </div>
          <h2>No Orders Yet</h2>
          <p>Looks like you haven't placed any orders yet.</p>
          <p className="oh-empty-subtitle">Start exploring our amazing collection!</p>
          <Link to="/" className="oh-start-shopping-btn oh-premium-btn">
            Start Shopping
            <FaShoppingBag className="oh-btn-icon" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="oh-orders-container">
      <div className="oh-orders-wrapper">
        {/* Header Section */}
        <div className="oh-orders-header oh-glass-effect">
          <div className="oh-header-content">
            <h1>My Orders</h1>
            <p className="oh-order-count">{filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found</p>
          </div>
          
          {/* Stats Cards */}
          <div className="oh-stats-grid">
            <div className="oh-stat-card">
              <div className="oh-stat-icon oh-total-icon">
                <FaShoppingBag />
              </div>
              <div className="oh-stat-info">
                <span className="oh-stat-value">{stats.total}</span>
                <span className="oh-stat-label">Total Orders</span>
              </div>
            </div>
            <div className="oh-stat-card">
              <div className="oh-stat-icon oh-delivered-icon">
                <FaCheckCircle />
              </div>
              <div className="oh-stat-info">
                <span className="oh-stat-value">{stats.delivered}</span>
                <span className="oh-stat-label">Delivered</span>
              </div>
            </div>
            <div className="oh-stat-card">
              <div className="oh-stat-icon oh-pending-icon">
                <FaClock />
              </div>
              <div className="oh-stat-info">
                <span className="oh-stat-value">{stats.pending}</span>
                <span className="oh-stat-label">In Progress</span>
              </div>
            </div>
            <div className="oh-stat-card">
              <div className="oh-stat-icon oh-cancelled-icon">
                <FaBox />
              </div>
              <div className="oh-stat-info">
                <span className="oh-stat-value">{stats.cancelled}</span>
                <span className="oh-stat-label">Cancelled</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="oh-filters-section">
            <div className="oh-search-box">
              <FaSearch className="oh-search-icon" />
              <input
                type="text"
                placeholder="Search by order ID or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="oh-filter-buttons">
              <button 
                className={`oh-filter-btn ${filterStatus === 'all' ? 'oh-active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                All Orders
              </button>
              <button 
                className={`oh-filter-btn ${filterStatus === 'Pending' ? 'oh-active' : ''}`}
                onClick={() => setFilterStatus('Pending')}
              >
                Pending
              </button>
              <button 
                className={`oh-filter-btn ${filterStatus === 'Shipped' ? 'oh-active' : ''}`}
                onClick={() => setFilterStatus('Shipped')}
              >
                Shipped
              </button>
              <button 
                className={`oh-filter-btn ${filterStatus === 'Delivered' ? 'oh-active' : ''}`}
                onClick={() => setFilterStatus('Delivered')}
              >
                Delivered
              </button>
              <button 
                className={`oh-filter-btn ${filterStatus === 'Cancelled' ? 'oh-active' : ''}`}
                onClick={() => setFilterStatus('Cancelled')}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="oh-orders-list">
          {filteredOrders.map((order) => (
            <div key={order.id} className="oh-order-card oh-glass-effect oh-card-hover">
              <div className="oh-order-header">
                <div className="oh-order-info">
                  <div className="oh-order-id-group">
                    <div className="oh-order-id-badge">
                      <FaBox className="oh-order-icon" />
                      <strong>Order #{order.orderId}</strong>
                    </div>
                    <div className="oh-order-date">
                      <FaCalendar />
                      <span>{formatDate(order.date)}</span>
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Order Progress */}
              {order.status !== 'Cancelled' && getProgressSteps(order.status)}

              {/* Items Preview */}
              <div className="oh-order-items-preview">
                <div className="oh-items-scroll">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="oh-order-item-preview">
                      <div className="oh-item-image-wrapper">
                        <img src={item.thumbnail} alt={item.title} />
                        <span className="oh-item-quantity-badge">{item.quantity}</span>
                      </div>
                      <div className="oh-item-preview-info">
                        <span className="oh-item-title">{item.title}</span>
                        <span className="oh-item-price">{formatPrice(item.price * (1 - (item.discountPercentage || 0) / 100) * 20)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="oh-order-footer">
                <div className="oh-order-summary">
                  <div className="oh-order-total">
                    <FaRupeeSign className="oh-total-icon" />
                    <div>
                      <span className="oh-total-label">Total Amount</span>
                      <span className="oh-total-value">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                  <div className="oh-order-payment">
                    <span className="oh-payment-label">Payment Method</span>
                    <span className="oh-payment-value">{order.paymentMethod}</span>
                  </div>
                </div>
                
                <div className="oh-order-actions">
                  <button 
                    className="oh-action-btn oh-details-btn"
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                  >
                    {selectedOrder?.id === order.id ? <FaChevronUp /> : <FaChevronDown />}
                    {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                  </button>
                  
                  {order.status === 'Delivered' && (
                    <button className="oh-action-btn oh-review-btn">
                      <FaStar /> Write a Review
                    </button>
                  )}
                  
                  <button className="oh-action-btn oh-print-btn" onClick={() => handlePrint(order)}>
                    <FaPrint /> Print
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedOrder?.id === order.id && (
                <div className="oh-order-details-expanded oh-slide-down">
                  <div className="oh-expanded-grid">
                    <div className="oh-delivery-address oh-premium-card">
                      <h4>
                        <FaMapMarkerAlt className="oh-section-icon" />
                        Delivery Address
                      </h4>
                      <div className="oh-address-content">
                        <p className="oh-address-name"><strong>{order.address.fullName}</strong></p>
                        <p>{order.address.addressLine1}</p>
                        {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                        <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                        <p className="oh-address-phone">📞 {order.address.phone}</p>
                      </div>
                    </div>

                    <div className="oh-order-summary-details oh-premium-card">
                      <h4>Order Summary</h4>
                      <div className="oh-summary-items">
                        <div className="oh-summary-row">
                          <span>Subtotal:</span>
                          <span>{formatPrice(order.total)}</span>
                        </div>
                        <div className="oh-summary-row">
                          <span>Delivery Charges:</span>
                          <span className="oh-free-delivery">Free</span>
                        </div>
                        <div className="oh-summary-row">
                          <span>Tax (GST):</span>
                          <span>{formatPrice(order.total * 0.18)}</span>
                        </div>
                        <div className="oh-summary-divider"></div>
                        <div className="oh-summary-row oh-total">
                          <span>Total:</span>
                          <span>{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="oh-all-order-items">
                    <h4>
                      <FaShoppingBag className="oh-section-icon" />
                      Order Items ({order.items.length})
                    </h4>
                    <div className="oh-items-grid">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="oh-order-item-full oh-premium-card">
                          <div className="oh-item-full-image">
                            <img src={item.thumbnail} alt={item.title} />
                          </div>
                          <div className="oh-order-item-details">
                            <h5>{item.title}</h5>
                            <p className="oh-item-brand">Brand: {item.brand}</p>
                            <div className="oh-item-meta">
                              <span className="oh-item-quantity">Quantity: {item.quantity}</span>
                              <span className="oh-item-price-each">Price: {formatPrice(item.price * (1 - (item.discountPercentage || 0) / 100) * 20)} each</span>
                            </div>
                            <p className="oh-item-subtotal">
                              Subtotal: {formatPrice(item.price * (1 - (item.discountPercentage || 0) / 100) * 20 * item.quantity)}
                            </p>
                            <button onClick={()=> navigate("/product/"+item.id)} className="oh-buy-again-btn">Buy Again</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.status === 'Delivered' && (
                    <div className="oh-order-review-section">
                      <div className="oh-rating-prompt">
                        <h4>Love this product?</h4>
                        <p>Share your experience with others!</p>
                        <div className="oh-rating-stars">
                          {[1, 2, 3, 4, 5].map(star => (
                            <FaStar key={star} className="oh-star-icon" />
                          ))}
                        </div>
                        <button className="oh-write-review-btn">Write a Detailed Review</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="oh-no-results oh-glass-effect">
            <FaSearch className="oh-no-results-icon" />
            <h3>No orders found</h3>
            <p>Try adjusting your filters or search term</p>
            <button onClick={() => {
              setFilterStatus('all');
              setSearchTerm('');
            }} className="oh-clear-filters-btn">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;