// import React, { useEffect, useState } from 'react';
// import QRCode from 'qrcode';
// import { useNavigate, Link } from 'react-router-dom';
// import { 
//   FaClock, FaCopy, FaCheck, FaArrowLeft, FaQrcode, 
//   FaMobileAlt, FaShieldAlt, FaExclamationTriangle,
//   FaRupeeSign, FaLock, FaTimes
// } from 'react-icons/fa';
// import toast from 'react-hot-toast';
// import "./css/paypage.css"

// const Payments = () => {
//   const [qrImage, setQrImage] = useState("");
//   const total = localStorage.getItem("total");
//   const [copied, setCopied] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const upiId = "BHARATPE.8O0R1G2V6P84518@fbpe";
//   const name = "Harjeet";
//   const [orderId] = useState(() => {
//     const savedOrderId = localStorage.getItem('payment_orderId');
//     return savedOrderId || ("ORD" + Date.now() + Math.floor(Math.random() * 1000));
//   });
//   const [time, setTime] = useState(() => {
//     const savedExpiry = localStorage.getItem('payment_expiry');
//     if (savedExpiry) {
//       const remaining = Math.floor((parseInt(savedExpiry) - Date.now()) / 1000);
//       return remaining > 0 ? remaining : 0;
//     }
//     return 90; 
//   });
  
//   const upiLink = `upi://pay?pa=${upiId}&pn=${name}&am=${total}&cu=INR&tn=${orderId}`;
//   const min = Math.floor(time / 60);
//   const sec = time % 60;
//   const navigate = useNavigate();

//   // Handle resize
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Save orderId to localStorage
//   useEffect(() => {
//     if (orderId) {
//       localStorage.setItem('payment_orderId', orderId);
//     }
//   }, [orderId]);

//   // Save expiry time
//   useEffect(() => {
//     if (time > 0) {
//       const expiryTime = Date.now() + (time * 1000);
//       localStorage.setItem('payment_expiry', expiryTime.toString());
//     }
//   }, [time]);

//   // Generate QR code
//   useEffect(() => {
//     if (total && total > 0 && orderId) {
//       QRCode.toDataURL(upiLink, {
//         width: 300,
//         margin: 2,
//         color: {
//           dark: '#000000',
//           light: '#ffffff'
//         }
//       }).then(setQrImage).catch(err => {
//         console.error('QR Generation failed:', err);
//         toast.error('Failed to generate QR code');
//       });
//     }
//   }, [total, upiLink, orderId]);

//   // Timer countdown
//   useEffect(() => {
//     if (time > 0) {
//       const timer = setInterval(() => {
//         setTime((prev) => {
//           const newTime = prev - 1;
//           if (newTime <= 0) {
//             localStorage.removeItem('payment_orderId');
//             localStorage.removeItem('payment_expiry');
//             toast.error('Payment session expired!');
//           }
//           return newTime;
//         });
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//   }, [time]);

//   // Handle expiry redirect
//   useEffect(() => {
//     if (time <= 0) {
//       const redirectTimer = setTimeout(() => {
//         navigate("/cart");
//       }, 5000);
//       return () => clearTimeout(redirectTimer);
//     }
//   }, [time, navigate]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (time <= 0) {
//         localStorage.removeItem('payment_orderId');
//         localStorage.removeItem('payment_expiry');
//       }
//     };
//   }, [time]);

//   const handleCopyUpi = () => {
//     navigator.clipboard.writeText(upiId).then(() => {
//       setCopied(true);
//       toast.success('UPI ID copied!');
//       setTimeout(() => setCopied(false), 2000);
//     }).catch(() => {
//       toast.error('Failed to copy UPI ID');
//     });
//   };

//   const handlePayNow = () => {
//     if (isMobile) {
//       // On mobile, try to open UPI app
//       window.location.href = upiLink;
//     } else {
//       // On desktop, show QR or copy UPI
//       toast.success('Scan QR code or use UPI ID to pay');
//     }
//   };

//   // Expired State
//   if (time <= 0) {
//     return (
//       <div className="payment-container">
//         <div className="payment-card expired">
//           <div className="expired-content">
//             <div className="expired-icon">⏰</div>
//             <h2>Session Expired!</h2>
//             <p>Your payment session has timed out. Please try again.</p>
//             <div className="expired-actions">
//               <Link to="/cart" className="btn-back">
//                 <FaArrowLeft /> Go to Cart
//               </Link>
//               <button onClick={() => window.location.reload()} className="btn-retry">
//                 Try Again
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Invalid/No Total
//   if (!total || total <= 0) {
//     return (
//       <div className="payment-container">
//         <div className="payment-card error">
//           <div className="error-content">
//             <FaExclamationTriangle className="error-icon" />
//             <h2>Payment Error</h2>
//             <p>No items found in your cart. Please add items before proceeding to payment.</p>
//             <Link to="/products" className="btn-back">
//               <FaArrowLeft /> Browse Products
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="payment-container">
//       <div className="payment-background">
//         <div className="bg-circle bg-circle-1"></div>
//         <div className="bg-circle bg-circle-2"></div>
//         <div className="bg-circle bg-circle-3"></div>
//       </div>

//       <div className="payment-card">
//         {/* Header */}
//         <div className="payment-header">
//           <button onClick={() => navigate(-1)} className="header-back-btn">
//             <FaArrowLeft />
//           </button>
//           <div className="header-content">
//             <h1>Complete Payment</h1>
//             <p>Secure UPI Payment</p>
//           </div>
//           <div className="header-lock">
//             <FaLock />
//           </div>
//         </div>

//         <div className="payment-body">
//           {/* Order Summary */}
//           <div className="order-summary">
//             <div className="summary-item">
//               <span className="summary-label">Order ID</span>
//               <span className="summary-value order-id">{orderId}</span>
//             </div>
//             <div className="summary-divider"></div>
//             <div className="summary-item total">
//               <span className="summary-label">Total Amount</span>
//               <span className="summary-value amount">
//                 <FaRupeeSign className="rupee-icon" />
//                 {total}
//               </span>
//             </div>
//           </div>

//           {/* Timer Section */}
//           <div className={`timer-section ${time <= 60 ? 'urgent' : ''}`}>
//             <div className="timer-content">
//               <div className="timer-icon-wrapper">
//                 <FaClock className={`timer-icon ${time <= 60 ? 'pulse' : ''}`} />
//               </div>
//               <div className="timer-info">
//                 <span className="timer-label">Complete payment within</span>
//                 <span className="timer-value">
//                   {min.toString().padStart(2, '0')}:{sec.toString().padStart(2, '0')}
//                 </span>
//               </div>
//             </div>
//             {time <= 60 && (
//               <div className="timer-warning">
//                 ⚠️ Hurry up! Your order will expire soon
//               </div>
//             )}
//             <div className="timer-progress">
//               <div 
//                 className="timer-progress-bar" 
//                 style={{ width: `${(time / 300) * 100}%` }}
//               ></div>
//             </div>
//           </div>

//           {/* QR Code Section */}
//           <div className="qr-section">
//             <div className="qr-header">
//               <FaQrcode className="qr-header-icon" />
//               <span>Scan QR Code to Pay</span>
//             </div>
//             <div className="qr-container">
//               {qrImage ? (
//                 <img src={qrImage} alt="UPI QR Code" className="qr-image" />
//               ) : (
//                 <div className="qr-loading">
//                   <div className="qr-spinner"></div>
//                   <span>Generating QR...</span>
//                 </div>
//               )}
//             </div>
//             <p className="qr-instruction">
//               Open any UPI app and scan this QR code
//             </p>
//           </div>

//           {/* UPI ID Section */}
//           <div className="upi-section">
//             <span className="upi-label">Or pay using UPI ID</span>
//             <div className="upi-box">
//               <code className="upi-id">{upiId}</code>
//               <button 
//                 className={`copy-btn ${copied ? 'copied' : ''}`}
//                 onClick={handleCopyUpi}
//               >
//                 {copied ? <FaCheck /> : <FaCopy />}
//                 <span>{copied ? 'Copied!' : 'Copy'}</span>
//               </button>
//             </div>
//           </div>

//           {/* Pay Button */}
//           <button onClick={handlePayNow} className="pay-now-btn">
//             {isMobile ? (
//               <>
//                 <FaMobileAlt />
//                 <span>Pay ₹{total} via UPI App</span>
//               </>
//             ) : (
//               <>
//                 <FaQrcode />
//                 <span>Pay ₹{total}</span>
//               </>
//             )}
//           </button>

//           {/* Security Badge */}
//           <div className="security-badge">
//             <FaShieldAlt className="security-icon" />
//             <span>100% Secure Payment | SSL Encrypted</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Payments;