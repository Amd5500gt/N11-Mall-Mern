import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useNavigate, Link } from 'react-router-dom';
import { FaClock, FaCopy, FaCheck, FaArrowLeft, FaQrcode, FaMobileAlt, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';

const Payments = () => {
  const [qrImage, setQrImage] = useState("");
  const total = localStorage.getItem("total")
  const [copied, setCopied] = useState(false);
  const upiId = "BHARATPE.8O0R1G2V6P84518@fbpe";
  const name = "Harjeet";
  const [orderId, setOrderId] = useState(() => {
    // Load saved orderId from localStorage
    const savedOrderId = localStorage.getItem('payment_orderId');
    return savedOrderId || ("ORD" + Date.now() + Math.floor(Math.random() * 1000));
  });
  const [time, setTime] = useState(() => {
    // Load saved expiry time from localStorage
    const savedExpiry = localStorage.getItem('payment_expiry');
    if (savedExpiry) {
      const remaining = Math.floor((parseInt(savedExpiry) - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    }
    return 300; // 5 minutes default
  });
  
  const upiLink = `upi://pay?pa=${upiId}&pn=${name}&am=${total}&cu=INR&tn=${orderId}`;
  const min = Math.floor(time / 60);
  const sec = time % 60;
  const navigate = useNavigate();

  // Save orderId and expiry time to localStorage
  useEffect(() => {
    if (orderId) {
      localStorage.setItem('payment_orderId', orderId);
    }
  }, [orderId]);

  useEffect(() => {
    // Set expiry time when component mounts or time updates
    if (time > 0) {
      const expiryTime = Date.now() + (time * 1000);
      localStorage.setItem('payment_expiry', expiryTime);
    }
  }, [time]);

  // Generate QR code
  useEffect(() => {
    if (total && total > 0 && orderId) {
      QRCode.toDataURL(upiLink).then(setQrImage);
    }
  }, [total, upiLink, orderId]);

  // Timer countdown
  useEffect(() => {
    if (time > 0) {
      const timer = setInterval(() => {
        setTime((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            // Clear localStorage when expired
            localStorage.removeItem('payment_orderId');
            localStorage.removeItem('payment_expiry');
          }
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [time]);

  // Handle expiry
  useEffect(() => {
    if (time <= 0) {
      const redirectTimer = setTimeout(() => {
        navigate("/cart");
      }, 3000);
      return () => clearTimeout(redirectTimer);
    }
  }, [time, navigate]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Clear payment data on unmount if expired
  useEffect(() => {
    return () => {
      if (time <= 0) {
        localStorage.removeItem('payment_orderId');
        localStorage.removeItem('payment_expiry');
      }
    };
  }, [time]);

  const styles = {
    container: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100vw",
      height: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      overflow: "hidden",
      margin: 0,
      padding: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    backgroundPattern: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
      pointerEvents: "none",
    },
    paymentCard: {
      maxWidth: "500px",
      width: "90%",
      maxHeight: "90vh",
      background: "white",
      borderRadius: "32px",
      overflow: "auto",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      animation: "slideUp 0.5s ease-out",
      position: "relative",
      zIndex: 1,
    },
    header: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "1.5rem",
      textAlign: "center",
      color: "white",
    },
    headerTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      marginBottom: "0.25rem",
    },
    headerSubtitle: {
      fontSize: "0.8rem",
      opacity: 0.9,
    },
    content: {
      padding: "1.5rem",
    },
    orderInfo: {
      background: "#f8f9fa",
      borderRadius: "16px",
      padding: "1rem",
      marginBottom: "1rem",
    },
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.5rem 0",
      borderBottom: "1px solid #e5e7eb",
    },
    infoLabel: {
      fontSize: "0.8rem",
      color: "#6b7280",
      fontWeight: "500",
    },
    infoValue: {
      fontSize: "0.8rem",
      fontWeight: "600",
      color: "#1f2937",
    },
    amount: {
      fontSize: "1.125rem",
      fontWeight: "800",
      color: "#667eea",
    },
    timerSection: {
      background: "linear-gradient(135deg, #fef3c7, #fde68a)",
      borderRadius: "16px",
      padding: "1rem",
      textAlign: "center",
      marginBottom: "1rem",
    },
    timerIcon: {
      fontSize: "20px",
      color: "#d97706",
      marginBottom: "0.25rem",
    },
    timerLabel: {
      fontSize: "0.7rem",
      color: "#92400e",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    timerValue: {
      fontSize: "1.75rem",
      fontWeight: "800",
      color: "#92400e",
      fontFamily: "monospace",
    },
    timerWarning: {
      fontSize: "0.65rem",
      color: "#92400e",
      marginTop: "0.25rem",
    },
    qrSection: {
      textAlign: "center",
      marginBottom: "1rem",
    },
    qrLabel: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      fontSize: "0.9rem",
      fontWeight: "600",
      color: "#1f2937",
      marginBottom: "0.75rem",
    },
    qrBox: {
      background: "white",
      padding: "0.75rem",
      borderRadius: "16px",
      display: "inline-block",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      border: "2px solid #e5e7eb",
    },
    qrImage: {
      width: "180px",
      height: "180px",
      display: "block",
    },
    upiSection: {
      background: "#f8f9fa",
      borderRadius: "12px",
      padding: "0.75rem",
      marginBottom: "1rem",
    },
    upiLabel: {
      fontSize: "0.7rem",
      color: "#6b7280",
      marginBottom: "0.25rem",
    },
    upiBox: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "white",
      padding: "0.5rem 0.75rem",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
    },
    upiId: {
      fontFamily: "monospace",
      fontSize: "0.75rem",
      color: "#1f2937",
      wordBreak: "break-all",
    },
    copyBtn: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#667eea",
      padding: "0.25rem 0.5rem",
      borderRadius: "6px",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
      fontSize: "0.7rem",
    },
    payBtn: {
      width: "100%",
      padding: "0.75rem",
      background: "linear-gradient(135deg, #10b981, #059669)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontSize: "0.9rem",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textDecoration: "none",
    },
    note: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "0.65rem",
      color: "#9ca3af",
      marginTop: "0.75rem",
      justifyContent: "center",
    },
    expiredCard: {
      textAlign: "center",
      padding: "2rem",
    },
    expiredIcon: {
      fontSize: "48px",
      color: "#ef4444",
      marginBottom: "0.75rem",
    },
    expiredTitle: {
      fontSize: "1.25rem",
      fontWeight: "700",
      color: "#dc2626",
      marginBottom: "0.5rem",
    },
    expiredText: {
      fontSize: "0.8rem",
      color: "#6b7280",
      marginBottom: "1rem",
    },
    backBtn: {
      padding: "0.6rem 1.2rem",
      background: "#6366f1",
      color: "white",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "0.85rem",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      textDecoration: "none",
    },
    footer: {
      padding: "0.75rem 1.5rem",
      background: "#f8f9fa",
      textAlign: "center",
      borderTop: "1px solid #e5e7eb",
    },
    secure: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      fontSize: "0.7rem",
      color: "#6b7280",
    },
  };

  // Add keyframes as style tag
  const keyframes = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }
    
    /* Custom scrollbar for payment card */
    ${styles.paymentCard.overflow === 'auto' && `
      ::-webkit-scrollbar {
        width: 6px;
      }
      
      ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: #667eea;
        border-radius: 10px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: #764ba2;
      }
    `}
  `;

  if (!total || total <= 0) {
    return (
      <div style={styles.container}>
        <style>{keyframes}</style>
        <div style={styles.backgroundPattern}></div>
        <div style={styles.paymentCard}>
          <div style={styles.header}>
            <h1 style={styles.headerTitle}>Payment Error</h1>
            <p style={styles.headerSubtitle}>Something went wrong</p>
          </div>
          <div style={{ ...styles.content, textAlign: "center" }}>
            <FaExclamationTriangle style={{ fontSize: "40px", color: "#ef4444", marginBottom: "0.75rem" }} />
            <h3 style={{ marginBottom: "0.5rem", color: "#1f2937", fontSize: "1rem" }}>No items in cart</h3>
            <p style={{ color: "#6b7280", marginBottom: "1rem", fontSize: "0.8rem" }}>Please add items to your cart before proceeding to payment.</p>
            <Link to="/products" style={styles.backBtn}>
              <FaArrowLeft /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (time <= 0) {
    return (
      <div style={styles.container}>
        <style>{keyframes}</style>
        <div style={styles.backgroundPattern}></div>
        <div style={styles.paymentCard}>
          <div style={styles.expiredCard}>
            <div style={styles.expiredIcon}>⏰</div>
            <h2 style={styles.expiredTitle}>Order Expired!</h2>
            <p style={styles.expiredText}>Your payment session has timed out. Please try again.</p>
            <Link to="/cart" style={styles.backBtn}>
              <FaArrowLeft /> Go Back to Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      <div style={styles.backgroundPattern}></div>
      
      <div style={styles.paymentCard}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Complete Payment</h1>
          <p style={styles.headerSubtitle}>Scan & pay securely with UPI</p>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Order Info */}
          <div style={styles.orderInfo}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Order ID</span>
              <span style={styles.infoValue}>{orderId}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Total Amount</span>
              <span style={{ ...styles.infoValue, ...styles.amount }}>₹{total}</span>
            </div>
          </div>

          {/* Timer */}
          <div style={styles.timerSection}>
            <div style={styles.timerIcon}>
              <FaClock />
            </div>
            <div style={styles.timerLabel}>Complete payment within</div>
            <div style={styles.timerValue}>
              {min.toString().padStart(2, '0')}:{sec.toString().padStart(2, '0')}
            </div>
            {time <= 60 && (
              <div style={styles.timerWarning}>
                ⚠️ Hurry up! Order will expire soon
              </div>
            )}
          </div>

          {/* QR Code */}
          <div style={styles.qrSection}>
            <div style={styles.qrLabel}>
              <FaQrcode /> Scan QR Code
            </div>
            <div style={styles.qrBox}>
              {qrImage ? (
                <img src={qrImage} alt="UPI QR Code" style={styles.qrImage} />
              ) : (
                <div style={{ ...styles.qrImage, display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6", fontSize: "0.8rem" }}>
                  Loading...
                </div>
              )}
            </div>
          </div>


          {/* Pay Button */}
          <a href={upiLink} target="_blank" rel="noopener noreferrer" style={styles.payBtn}>
            <FaMobileAlt /> Pay ₹{total} via UPI App
          </a>

          {/* Note */}
          <div style={styles.note}>
            <FaShieldAlt />
            <span>100% Secure Payment | UPI Verified</span>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.secure}>
            <span>🔒</span>
            <span>SSL Encrypted Transaction</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;