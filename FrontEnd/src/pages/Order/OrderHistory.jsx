import React, {
  useState,
  useEffect,
  useMemo
} from 'react';

import {
  Link,
  useNavigate
} from 'react-router-dom';

import {
  FaBox,
  FaCalendar,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronUp,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaShoppingBag,
  FaStar,
  FaSearch,
  FaPrint,
  FaTimesCircle,
  FaRedo,
  FaDownload
} from 'react-icons/fa';

import './OrderHistory.css';

import toast from 'react-hot-toast';

import api from '../../utils/api';

const OrderHistory = () => {

  const navigate = useNavigate();

  /* ================= STATES ================= */

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedOrder,
    setSelectedOrder] =
    useState(null);

  const [filterStatus,
    setFilterStatus] =
    useState('all');

  const [searchTerm,
    setSearchTerm] =
    useState('');

  const [sortBy,
    setSortBy] =
    useState('latest');

  /* ================= FETCH ORDERS ================= */

  const fetchOrders = async () => {

    try {

      setLoading(true);

      const res =
        await api.post(
          "/user/orders"
        );

      const data = res.data;

      if (data.success) {

        setOrders(data.orders);

      }

    } catch (err) {

      console.log(err);

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

  /* ================= FILTER + SEARCH + SORT ================= */

  const filteredOrders = useMemo(() => {

    let filtered = [...orders];

    // FILTER STATUS
    if (filterStatus !== 'all') {

      filtered =
        filtered.filter(
          order =>
            order.status ===
            filterStatus
        );

    }

    // SEARCH
    if (searchTerm) {

      filtered =
        filtered.filter(order =>

          order.orderId
            ?.toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            ) ||

          order.items.some(item =>
            item.title
              ?.toLowerCase()
              .includes(
                searchTerm.toLowerCase()
              )
          )

        );

    }

    // SORT
    if (sortBy === 'latest') {

      filtered.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );

    }

    if (sortBy === 'oldest') {

      filtered.sort(
        (a, b) =>
          new Date(a.createdAt) -
          new Date(b.createdAt)
      );

    }

    if (sortBy === 'high') {

      filtered.sort(
        (a, b) =>
          b.total - a.total
      );

    }

    if (sortBy === 'low') {

      filtered.sort(
        (a, b) =>
          a.total - b.total
      );

    }

    return filtered;

  }, [
    orders,
    filterStatus,
    searchTerm,
    sortBy
  ]);

  /* ================= STATS ================= */

  const stats = useMemo(() => {

    return {

      total:
        orders.length,

      delivered:
        orders.filter(
          o =>
            o.status ===
            'Delivered'
        ).length,

      pending:
        orders.filter(
          o =>
            o.status === 'Pending' ||
            o.status === 'Confirmed' ||
            o.status === 'Shipped'
        ).length,

      cancelled:
        orders.filter(
          o =>
            o.status ===
            'Cancelled'
        ).length

    };

  }, [orders]);

  /* ================= HELPERS ================= */

  const formatDate = (
    dateString
  ) => {

    return new Date(
      dateString
    ).toLocaleDateString(
      'en-IN',
      {

        day: 'numeric',
        month: 'long',
        year: 'numeric'

      }
    );

  };

  const formatPrice = (
    price
  ) => {

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

  /* ================= STATUS BADGE ================= */

  const getStatusBadge = (
    status
  ) => {

    const config = {

      Pending: {
        icon: <FaClock />,
        className:
          'oh-status-pending'
      },

      Confirmed: {
        icon:
          <FaCheckCircle />,
        className:
          'oh-status-confirmed'
      },

      Shipped: {
        icon: <FaTruck />,
        className:
          'oh-status-shipped'
      },

      Delivered: {
        icon:
          <FaCheckCircle />,
        className:
          'oh-status-delivered'
      },

      Cancelled: {
        icon:
          <FaTimesCircle />,
        className:
          'oh-status-cancelled'
      }

    };

    const current =
      config[status] ||
      config.Pending;

    return (

      <span
        className={`oh-status-badge ${current.className}`}
      >

        {current.icon}

        {status}

      </span>

    );

  };

  /* ================= TIMELINE ================= */

  const getTimeline = (
    status
  ) => {

    const steps = [

      'Pending',

      'Confirmed',

      'Shipped',

      'Delivered'

    ];

    const currentIndex =
      steps.indexOf(status);

    return (

      <div className="oh-timeline">

        {steps.map(
          (step, index) => (

            <div
              key={step}

              className={`oh-timeline-step ${index <= currentIndex
                ? 'active'
                : ''
                }`}
            >

              <div className="oh-dot" />

              <span>
                {step}
              </span>

            </div>

          )
        )}

      </div>

    );

  };

  /* ================= PRINT ================= */

  const handlePrint = (
    order
  ) => {

    window.print();

  };

  /* ================= LOADING ================= */

  if (loading) {

    return (

      <div className="oh-loading-container">

        <div className="oh-loader"></div>

      </div>

    );

  }

  /* ================= EMPTY ================= */

  if (!loading &&
    orders.length === 0
  ) {

    return (

      <div className="oh-empty-orders">

        <FaShoppingBag className="oh-empty-icon" />

        <h2>
          No Orders Yet
        </h2>

        <p>
          Start shopping to see your orders here.
        </p>

        <Link
          to="/"
          className="oh-shop-btn"
        >

          Start Shopping

        </Link>

      </div>

    );

  }

  return (

    <div className="oh-container">

      {/* ================= HEADER ================= */}

      <div className="oh-header">

        <div>

          <h1>
            My Orders
          </h1>

          <p>
            Manage and track your orders
          </p>

        </div>

      </div>

      {/* ================= STATS ================= */}

      <div className="oh-stats-grid">

        <div className="oh-stat-card">

          <FaShoppingBag />

          <h3>
            {stats.total}
          </h3>

          <p>
            Total Orders
          </p>

        </div>

        <div className="oh-stat-card">

          <FaCheckCircle />

          <h3>
            {stats.delivered}
          </h3>

          <p>
            Delivered
          </p>

        </div>

        <div className="oh-stat-card">

          <FaClock />

          <h3>
            {stats.pending}
          </h3>

          <p>
            In Progress
          </p>

        </div>

        <div className="oh-stat-card">

          <FaTimesCircle />

          <h3>
            {stats.cancelled}
          </h3>

          <p>
            Cancelled
          </p>

        </div>

      </div>

      {/* ================= FILTERS ================= */}

      <div className="oh-filters">

        <div className="oh-search-box">

          <FaSearch />

          <input
            type="text"

            placeholder="Search orders..."

            value={searchTerm}

            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />

        </div>

        <select
          value={filterStatus}

          onChange={(e) =>
            setFilterStatus(
              e.target.value
            )
          }
        >

          <option value="all">
            All
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Confirmed">
            Confirmed
          </option>

          <option value="Shipped">
            Shipped
          </option>

          <option value="Delivered">
            Delivered
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

        </select>

        <select
          value={sortBy}

          onChange={(e) =>
            setSortBy(
              e.target.value
            )
          }
        >

          <option value="latest">
            Latest
          </option>

          <option value="oldest">
            Oldest
          </option>

          <option value="high">
            Price High
          </option>

          <option value="low">
            Price Low
          </option>

        </select>

      </div>

      {/* ================= ORDERS ================= */}

      <div className="oh-orders-list">

        {filteredOrders.map(
          (order) => (

            <div
              key={order._id}

              className="oh-order-card"
            >

              {/* TOP */}

              <div className="oh-order-top">

                <div>

                  <h3>
                    #{order.orderId}
                  </h3>

                  <p>
                    <FaCalendar />

                    {formatDate(
                      order.createdAt
                    )}
                  </p>

                </div>

                {getStatusBadge(
                  order.status
                )}

              </div>

              {/* TIMELINE */}

              {
                order.status !==
                'Cancelled' &&

                getTimeline(
                  order.status
                )
              }

              {/* ITEMS */}

              <div className="oh-items">

                {order.items.map(
                  (item, idx) => (

                    <div
                      key={idx}

                      className="oh-item"
                    >

                      <img
                        src={
                          item.thumbnail
                        }

                        alt={
                          item.title
                        }
                      />

                      <div>

                        <h4>
                          {item.title}
                        </h4>

                        <p>
                          Qty:
                          {' '}
                          {item.quantity}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

              {/* FOOTER */}

              <div className="oh-order-footer">

                <div>

                  <span>
                    Total
                  </span>

                  <h2>
                    {formatPrice(
                      order.total
                    )}
                  </h2>

                </div>

                <div className="oh-actions">

                  <button
                    className="oh-btn"

                    onClick={() =>
                      handlePrint(
                        order
                      )
                    }
                  >

                    <FaPrint />

                    Print

                  </button>

                  <button
                    className="oh-btn"

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

                    Details

                  </button>

                </div>

              </div>

              {/* DETAILS */}

              {selectedOrder?._id ===
                order._id && (

                  <div className="oh-details">

                    {/* ADDRESS */}

                    <div className="oh-details-card">

                      <h4>

                        <FaMapMarkerAlt />

                        Delivery Address

                      </h4>

                      <p>
                        {order.address.fullName}
                      </p>

                      <p>
                        {order.address.addressLine1}
                      </p>

                      <p>
                        {order.address.city},
                        {' '}
                        {order.address.state}
                      </p>

                      <p>
                        {order.address.pincode}
                      </p>

                    </div>

                    {/* ITEMS */}

                    <div className="oh-details-card">

                      <h4>
                        Order Items
                      </h4>

                      {order.items.map(
                        (item, idx) => (

                          <div
                            key={idx}

                            className="oh-details-item"
                          >

                            <img
                              src={
                                item.thumbnail
                              }

                              alt={
                                item.title
                              }
                            />

                            <div>

                              <h5>
                                {item.title}
                              </h5>

                              <p>
                                Qty:
                                {' '}
                                {item.quantity}
                              </p>

                              <p>
                                {formatPrice(
                                  item.price
                                )}
                              </p>

                            </div>

                            <button
                              className="oh-buy-btn"

                              onClick={() =>
                                navigate(
                                  `/product/${item.id}`
                                )
                              }
                            >

                              <FaRedo />

                              Buy Again

                            </button>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                )}

            </div>

          )
        )}

      </div>

    </div>

  );

};

export default OrderHistory;