import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBox, FaCalendar, FaRupeeSign, FaMapMarkerAlt,
  FaChevronDown, FaChevronUp, FaTruck,
  FaCheckCircle, FaClock, FaShoppingBag,
  FaStar, FaSearch, FaPrint
} from 'react-icons/fa';

import './OrderHistory.css';

import toast from 'react-hot-toast';

import api from '../../utils/api';

const OrderHistory = () => {

  const [orders, setOrders] = useState([]);

  const [filteredOrders, setFilteredOrders] = useState([]);

  const navigate = useNavigate();

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

    fetchOrders();

  }, []);

  const fetchOrders = async () => {

    try {

      const res = await api.get(
        "/user/orders/history"
      );

      const data = res.data;

      if (data.success) {

        const sortedOrders =
          data.orders.sort(
            (a, b) =>
              new Date(b.createdAt) -
              new Date(a.createdAt)
          );

        setOrders(sortedOrders);

        setFilteredOrders(sortedOrders);

        calculateStats(sortedOrders);

      }

    } catch (err) {

      console.log(err);

      toast.error("Failed to fetch orders");

    }

  };

  useEffect(() => {

    filterOrders();

  }, [filterStatus, searchTerm, orders]);

  const calculateStats = (ordersList) => {

    const total = ordersList.length;

    const delivered =
      ordersList.filter(
        o => o.order.status === 'Delivered'
      ).length;

    const pending =
      ordersList.filter(
        o =>
          o.order.status === 'Pending' ||
          o.order.status === 'Confirmed' ||
          o.order.status === 'Shipped'
      ).length;

    const cancelled =
      ordersList.filter(
        o => o.order.status === 'Cancelled'
      ).length;

    setStats({
      total,
      delivered,
      pending,
      cancelled
    });

  };

  const filterOrders = () => {

    let filtered = [...orders];

    if (filterStatus !== 'all') {

      filtered = filtered.filter(
        order =>
          order.order.status === filterStatus
      );

    }

    if (searchTerm) {

      filtered = filtered.filter(order =>

        order.order.orderId
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||

        order.order.items.some(item =>
          item.title
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            )
        )

      );

    }

    setFilteredOrders(filtered);

  };

  const getStatusBadge = (status) => {

    const statusConfig = {

      'Pending': {
        class: 'oh-status-pending',
        icon: <FaClock />,
        text: 'Pending'
      },

      'Confirmed': {
        class: 'oh-status-confirmed',
        icon: <FaCheckCircle />,
        text: 'Confirmed'
      },

      'Shipped': {
        class: 'oh-status-shipped',
        icon: <FaTruck />,
        text: 'Shipped'
      },

      'Delivered': {
        class: 'oh-status-delivered',
        icon: <FaCheckCircle />,
        text: 'Delivered'
      },

      'Cancelled': {
        class: 'oh-status-cancelled',
        icon: <FaBox />,
        text: 'Cancelled'
      }

    };

    const config =
      statusConfig[status] ||
      statusConfig['Pending'];

    return (

      <span className={`oh-status-badge ${config.class}`}>

        {config.icon}

        {config.text}

      </span>

    );

  };

  const formatDate = (dateString) => {

    return new Date(dateString)
      .toLocaleDateString('en-IN', {

        day: 'numeric',

        month: 'long',

        year: 'numeric'

      });

  };

  const formatPrice = (price) => {

    return new Intl.NumberFormat(
      'en-IN',
      {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }
    ).format(price);

  };

  if (orders.length === 0) {

    return (

      <div className="oh-orders-container">

        <div className="oh-empty-orders oh-glass-effect">

          <div className="oh-empty-animation">

            <FaShoppingBag className="oh-empty-icon" />

          </div>

          <h2>No Orders Yet</h2>

          <p>
            Looks like you haven't placed any orders yet.
          </p>

          <Link
            to="/"
            className="oh-start-shopping-btn oh-premium-btn"
          >

            Start Shopping

          </Link>

        </div>

      </div>

    );

  }

  return (

    <div className="oh-orders-container">

      <div className="oh-orders-wrapper">

        <div className="oh-orders-list">

          {filteredOrders.map((order) => (

            <div
              key={order._id}
              className="oh-order-card oh-glass-effect oh-card-hover"
            >

              <div className="oh-order-header">

                <div className="oh-order-info">

                  <div className="oh-order-id-group">

                    <div className="oh-order-id-badge">

                      <FaBox className="oh-order-icon" />

                      <strong>
                        Order #{order.order.orderId}
                      </strong>

                    </div>

                    <div className="oh-order-date">

                      <FaCalendar />

                      <span>
                        {formatDate(order.createdAt)}
                      </span>

                    </div>

                  </div>

                  {getStatusBadge(order.order.status)}

                </div>

              </div>

              <div className="oh-order-items-preview">

                <div className="oh-items-scroll">

                  {order.order.items.map((item, idx) => (

                    <div
                      key={idx}
                      className="oh-order-item-preview"
                    >

                      <div className="oh-item-image-wrapper">

                        <img
                          src={item.thumbnail}
                          alt={item.title}
                        />

                        <span className="oh-item-quantity-badge">
                          {item.quantity}
                        </span>

                      </div>

                      <div className="oh-item-preview-info">

                        <span className="oh-item-title">
                          {item.title}
                        </span>

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

                      <span className="oh-total-label">
                        Total Amount
                      </span>

                      <span className="oh-total-value">
                        {formatPrice(order.order.total)}
                      </span>

                    </div>

                  </div>

                </div>

                <div className="oh-order-actions">

                  <button
                    className="oh-action-btn oh-details-btn"

                    onClick={() =>
                      setSelectedOrder(
                        selectedOrder?._id === order._id
                          ? null
                          : order
                      )
                    }
                  >

                    {selectedOrder?._id === order._id
                      ? <FaChevronUp />
                      : <FaChevronDown />
                    }

                    {selectedOrder?._id === order._id
                      ? 'Hide Details'
                      : 'View Details'
                    }

                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

};

export default OrderHistory;