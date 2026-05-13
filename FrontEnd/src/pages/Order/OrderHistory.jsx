import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBox, FaCalendar, FaRupeeSign, FaChevronDown, FaChevronUp,
  FaTruck, FaCheckCircle, FaClock, FaShoppingBag
} from 'react-icons/fa';
import './OrderHistory.css';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({ total: 0, delivered: 0, pending: 0, cancelled: 0 });

const fetchOrders = async () => {

  try {

    setLoading(true);

    const res =
      await api.post(
        "/user/orders"
      );

    if (res.data.success) {

      const sortedOrders =
        res.data.orders.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );

      setOrders(sortedOrders);

      setFilteredOrders(
        sortedOrders
      );

      calculateStats(
        sortedOrders
      );

    }

  } catch (err) {

    toast.error(
      "Failed to fetch orders"
    );

  } finally {

    setLoading(false);

  }

};

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.order.status === filterStatus);
    }

    setFilteredOrders(filtered);
  }, [filterStatus, orders]);

  const calculateStats = (ordersList) => {
    setStats({
      total: ordersList.length,
      delivered: ordersList.filter(o => o.order.status === 'Delivered').length,
      pending: ordersList.filter(o => ['Pending', 'Confirmed', 'Shipped'].includes(o.order.status)).length,
      cancelled: ordersList.filter(o => o.order.status === 'Cancelled').length
    });
  };

  const getStatusBadge = (status) => {
    const config = {
      'Pending': { class: 'oh-status-pending', icon: <FaClock />, text: 'Pending' },
      'Confirmed': { class: 'oh-status-confirmed', icon: <FaCheckCircle />, text: 'Confirmed' },
      'Shipped': { class: 'oh-status-shipped', icon: <FaTruck />, text: 'Shipped' },
      'Delivered': { class: 'oh-status-delivered', icon: <FaCheckCircle />, text: 'Delivered' },
      'Cancelled': { class: 'oh-status-cancelled', icon: <FaBox />, text: 'Cancelled' }
    };
    const c = config[status] || config['Pending'];
    return <span className={`oh-status-badge ${c.class}`}>{c.icon}{c.text}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);
  };

  if (loading) {

    return (

      <div className="oh-orders-container">

        {/* STATS SKELETON */}

        <div className="oh-stats-grid">

          {[1, 2, 3, 4].map((i) => (

            <div
              key={i}
              className="oh-stat-card oh-skeleton-card"
            >

              <div className="oh-skeleton oh-skeleton-stat"></div>

              <div className="oh-skeleton oh-skeleton-text"></div>

            </div>

          ))}

        </div>

        {/* ORDER CARDS SKELETON */}

        <div className="oh-orders-list">

          {[1, 2, 3].map((i) => (

            <div
              key={i}
              className="oh-order-card"
            >

              <div className="oh-skeleton oh-skeleton-title"></div>

              <div className="oh-skeleton oh-skeleton-small"></div>

              <div className="oh-skeleton-items">

                {[1, 2].map((j) => (

                  <div
                    key={j}
                    className="oh-skeleton-item"
                  >

                    <div className="oh-skeleton oh-skeleton-image"></div>

                    <div className="oh-skeleton-content">

                      <div className="oh-skeleton oh-skeleton-line"></div>

                      <div className="oh-skeleton oh-skeleton-line small"></div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          ))}

        </div>

      </div>

    );

  }
  return (
    <div className="oh-orders-container">
      {/* Stats Summary */}
      <div className="oh-stats-grid">
        <div className="oh-stat-card"><span className="oh-stat-value">{stats.total}</span><span>Total Orders</span></div>
        <div className="oh-stat-card"><span className="oh-stat-value">{stats.delivered}</span><span>Delivered</span></div>
        <div className="oh-stat-card"><span className="oh-stat-value">{stats.pending}</span><span>In Progress</span></div>
        <div className="oh-stat-card"><span className="oh-stat-value">{stats.cancelled}</span><span>Cancelled</span></div>
      </div>

      {/* Filter Tabs */}
      <div className="oh-filter-tabs">
        {['all', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
          <button key={status} className={`oh-filter-btn ${filterStatus === status ? 'active' : ''}`} onClick={() => setFilterStatus(status)}>
            {status === 'all' ? 'All Orders' : status}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {
  filteredOrders.length === 0 ? (

    <div className="oh-no-filter-orders">

      <FaBox className="oh-no-orders-icon" />

      <h3>
        No {filterStatus} Orders
      </h3>

      <p>

        {
          filterStatus === 'all'

            ? "No orders found."

            : `You don't have any ${filterStatus.toLowerCase()} orders yet.`
        }

      </p>

    </div>

  ) : (
      <div className="oh-orders-list">
        {filteredOrders.map((order) => (
          <div key={order._id} className="oh-order-card">
            <div className="oh-order-header">
              <div className="oh-order-info">
                <div className="oh-order-id-group">
                  <strong><FaBox /> Order #{order.order.orderId}</strong>
                  <span className="oh-order-date"><FaCalendar /> {formatDate(order.createdAt)}</span>
                </div>
                {getStatusBadge(order.order.status)}
              </div>
            </div>

            <div className="oh-order-items-preview">
              {order.order.items.slice(0, 3).map((item, idx) => (
                <div key={idx} className="oh-order-item-preview">
                  <img src={item.thumbnail} alt={item.title} />
                  <div className="oh-item-info">
                    <span className="oh-item-title">{item.title}</span>
                    <span className="oh-item-quantity">x{item.quantity}</span>
                  </div>
                </div>
              ))}
              {order.order.items.length > 3 && <span className="oh-more-items">+{order.order.items.length - 3} more</span>}
            </div>

            <div className="oh-order-footer">
              <div className="oh-order-total">
                <FaRupeeSign /> Total: {formatPrice(order.order.total)}
              </div>
              <button className="oh-details-btn" onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}>
                {selectedOrder?._id === order._id ? <FaChevronUp /> : <FaChevronDown />}
                {selectedOrder?._id === order._id ? 'Hide Details' : 'View Details'}
              </button>
            </div>

            {selectedOrder?._id === order._id && (
              <div className="oh-order-details">
                <div className="oh-detail-section">
                  <h4>Delivery Address</h4>
                  <p>{order.order.address?.street}, {order.order.address?.city}, {order.order.address?.state} - {order.order.address?.pincode}</p>
                </div>
                <div className="oh-detail-section">
                  <h4>All Items</h4>
                  {order.order.items.map((item, idx) => (
                    <div key={idx} className="oh-detail-item">
                      <span>{item.title} x{item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="oh-detail-total">Grand Total: {formatPrice(order.order.total)}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
  )
}
    </div>
  );
};

export default OrderHistory;