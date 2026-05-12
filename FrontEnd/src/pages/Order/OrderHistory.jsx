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
      'Pending': { class: 'pending', icon: <FaClock />, text: 'Pending' },
      'Confirmed': { class: 'confirmed', icon: <FaCheckCircle />, text: 'Confirmed' },
      'Shipped': { class: 'shipped', icon: <FaTruck />, text: 'Shipped' },
      'Delivered': { class: 'delivered', icon: <FaCheckCircle />, text: 'Delivered' },
      'Cancelled': { class: 'cancelled', icon: <FaBox />, text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig['Pending'];
    
    return (
      <span className={`status-badge ${config.class}`}>
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
      <div className="order-progress">
        {steps.map((step, index) => (
          <div key={index} className={`progress-step ${index <= currentStep ? 'active' : ''}`}>
            <div className="progress-dot"></div>
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
      <div className="orders-container">
        <div className="empty-orders glass-effect">
          <div className="empty-animation">
            <FaShoppingBag className="empty-icon" />
            <div className="empty-particles">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`empty-particle empty-particle-${i}`}></div>
              ))}
            </div>
          </div>
          <h2>No Orders Yet</h2>
          <p>Looks like you haven't placed any orders yet.</p>
          <p className="empty-subtitle">Start exploring our amazing collection!</p>
          <Link to="/" className="start-shopping-btn premium-btn">
            Start Shopping
            <FaShoppingBag className="btn-icon" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-wrapper">
        {/* Header Section */}
        <div className="orders-header glass-effect">
          <div className="header-content">
            <h1>My Orders</h1>
            <p className="order-count">{filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found</p>
          </div>
          
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total-icon">
                <FaShoppingBag />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Total Orders</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon delivered-icon">
                <FaCheckCircle />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.delivered}</span>
                <span className="stat-label">Delivered</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon pending-icon">
                <FaClock />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.pending}</span>
                <span className="stat-label">In Progress</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon cancelled-icon">
                <FaBox />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.cancelled}</span>
                <span className="stat-label">Cancelled</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by order ID or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                All Orders
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'Pending' ? 'active' : ''}`}
                onClick={() => setFilterStatus('Pending')}
              >
                Pending
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'Shipped' ? 'active' : ''}`}
                onClick={() => setFilterStatus('Shipped')}
              >
                Shipped
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'Delivered' ? 'active' : ''}`}
                onClick={() => setFilterStatus('Delivered')}
              >
                Delivered
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'Cancelled' ? 'active' : ''}`}
                onClick={() => setFilterStatus('Cancelled')}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order.id} className="order-card glass-effect card-hover">
              <div className="order-header">
                <div className="order-info">
                  <div className="order-id-group">
                    <div className="order-id-badge">
                      <FaBox className="order-icon" />
                      <strong>Order #{order.orderId}</strong>
                    </div>
                    <div className="order-date">
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
              <div className="order-items-preview">
                <div className="items-scroll">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item-preview">
                      <div className="item-image-wrapper">
                        <img src={item.thumbnail} alt={item.title} />
                        <span className="item-quantity-badge">{item.quantity}</span>
                      </div>
                      <div className="item-preview-info">
                        <span className="item-title">{item.title}</span>
                        <span className="item-price">{formatPrice(item.price * (1 - (item.discountPercentage || 0) / 100) * 20)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-footer">
                <div className="order-summary">
                  <div className="order-total">
                    <FaRupeeSign className="total-icon" />
                    <div>
                      <span className="total-label">Total Amount</span>
                      <span className="total-value">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                  <div className="order-payment">
                    <span className="payment-label">Payment Method</span>
                    <span className="payment-value">{order.paymentMethod}</span>
                  </div>
                </div>
                
                <div className="order-actions">
                  <button 
                    className="action-btn details-btn"
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                  >
                    {selectedOrder?.id === order.id ? <FaChevronUp /> : <FaChevronDown />}
                    {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                  </button>
                  
                  {order.status === 'Delivered' && (
                    <button className="action-btn review-btn">
                      <FaStar /> Write a Review
                    </button>
                  )}
                  
                  <button className="action-btn print-btn" onClick={() => handlePrint(order)}>
                    <FaPrint /> Print
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedOrder?.id === order.id && (
                <div className="order-details-expanded slide-down">
                  <div className="expanded-grid">
                    <div className="delivery-address premium-card">
                      <h4>
                        <FaMapMarkerAlt className="section-icon" />
                        Delivery Address
                      </h4>
                      <div className="address-content">
                        <p className="address-name"><strong>{order.address.fullName}</strong></p>
                        <p>{order.address.addressLine1}</p>
                        {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                        <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                        <p className="address-phone">📞 {order.address.phone}</p>
                      </div>
                    </div>

                    <div className="order-summary-details premium-card">
                      <h4>Order Summary</h4>
                      <div className="summary-items">
                        <div className="summary-row">
                          <span>Subtotal:</span>
                          <span>{formatPrice(order.total)}</span>
                        </div>
                        <div className="summary-row">
                          <span>Delivery Charges:</span>
                          <span className="free-delivery">Free</span>
                        </div>
                        <div className="summary-row">
                          <span>Tax (GST):</span>
                          <span>{formatPrice(order.total * 0.18)}</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row total">
                          <span>Total:</span>
                          <span>{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="all-order-items">
                    <h4>
                      <FaShoppingBag className="section-icon" />
                      Order Items ({order.items.length})
                    </h4>
                    <div className="items-grid">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item-full premium-card">
                          <div className="item-full-image">
                            <img src={item.thumbnail} alt={item.title} />
                          </div>
                          <div className="order-item-details">
                            <h5>{item.title}</h5>
                            <p className="item-brand">Brand: {item.brand}</p>
                            <div className="item-meta">
                              <span className="item-quantity">Quantity: {item.quantity}</span>
                              <span className="item-price-each">Price: {formatPrice(item.price * (1 - (item.discountPercentage || 0) / 100) * 20)} each</span>
                            </div>
                            <p className="item-subtotal">
                              Subtotal: {formatPrice(item.price * (1 - (item.discountPercentage || 0) / 100) * 20 * item.quantity)}
                            </p>
                            <button onClick={()=> navigate("/product/"+item.id)} className="buy-again-btn">Buy Again</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.status === 'Delivered' && (
                    <div className="order-review-section">
                      <div className="rating-prompt">
                        <h4>Love this product?</h4>
                        <p>Share your experience with others!</p>
                        <div className="rating-stars">
                          {[1, 2, 3, 4, 5].map(star => (
                            <FaStar key={star} className="star-icon" />
                          ))}
                        </div>
                        <button className="write-review-btn">Write a Detailed Review</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="no-results glass-effect">
            <FaSearch className="no-results-icon" />
            <h3>No orders found</h3>
            <p>Try adjusting your filters or search term</p>
            <button onClick={() => {
              setFilterStatus('all');
              setSearchTerm('');
            }} className="clear-filters-btn">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;