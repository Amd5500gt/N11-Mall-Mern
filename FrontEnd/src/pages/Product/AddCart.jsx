import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyCart from '../../components/ui/Emptycart';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft, FaCreditCard } from 'react-icons/fa';
import '../pages.css';
import { FaSpinner } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import  useCart  from '../../context/CartContext'; // Import the hook
import toast from 'react-hot-toast';
import { useContext } from 'react';

const AddCart = () => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [animateRemove, setAnimateRemove] = useState(null);
  
  // Get everything from context instead of props
  const { addedItems, newCart, removeCart, total } = useContext(useCart)

  let totalPrice = (total * 20).toFixed(2);
  const totalAmount = (totalPrice * 1.03).toFixed(2);

  const handleCheckoutItem = () => {
    setLoader(true);
    setTimeout(() => {
      navigate("/cart/payment");
      localStorage.setItem("total", totalAmount);
    }, 2000);
  };

  const handleRemove = async (item) => {
    setAnimateRemove(item.id);
    setTimeout(async () => {
      await removeCart(item);
      setAnimateRemove(null);
    }, 300);
  };

  if (addedItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="pages-container">
      <div className="cart-page">
        <div className="cart-header">
          <h1 className="cart-title-page">
            <FaShoppingBag className="header-icon" />
            Your Shopping Cart
          </h1>
          <p className="cart-subtitle">{addedItems.length} {addedItems.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items-section">
            {addedItems.map((item) => (
              <div 
                key={item.id} 
                className={`cart-item ${animateRemove === item.id ? 'removing' : ''}`}
              >
                <Link to={`/product/${item.id}`} className="cart-item-link">
                  <div className="cart-item-image">
                    <img src={item.thumbnail} alt={item.title} />
                  </div>
                  <div className="cart-item-details">
                    <h3 className="cart-item-title">{item.title}</h3>
                    {item.brand && <p className="cart-item-brand">{item.brand}</p>}
                    <div className="cart-item-price">
                      ₹{(item.price * 20).toFixed(2)}
                      {item.discountPercentage > 0 && (
                        <span className="item-discount">-{item.discountPercentage}%</span>
                      )}
                    </div>
                  </div>
                </Link>
                
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => removeCart(item)} 
                      className="qty-control-btn"
                    >
                      <FaMinus />
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button 
                      onClick={() => newCart(item)} 
                      className="qty-control-btn"
                      disabled={item.quantity >= item.stock}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <div className="item-total">
                    ₹{(item.price * 20 * item.quantity).toFixed(2)}
                  </div>
                  <button 
                    onClick={() => handleRemove(item)} 
                    className="remove-item-btn"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-ship">Free</span>
              </div>
              <div className="summary-row">
                <span>Tax (GST)</span>
                <span>₹{(totalPrice * 0.03).toFixed(2)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <button onClick={handleCheckoutItem} className="checkout-btn">
              {loader ? (
                <>Proceed to Checkout <FaSpinner className='spin' /></>
              ) : (
                <><FaCreditCard /> Proceed to Checkout</>
              )}
            </button>
            
            <Link to="/" className="continue-shopping">
              <FaArrowLeft /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCart;