import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyCart from '../../components/ui/Emptycart';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft, FaCreditCard } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const AddCart = () => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [animateRemove, setAnimateRemove] = useState(null);
  const [showAllCart, setShowAllCart] = useState(false);

  const { addedItems, newCart, removeCart, total, deleteCart } = useCart();

  const totalPrice = (Number(total) * 20).toFixed(2);
  const totalAmount = (Number(totalPrice) * 1.03).toFixed(2);

  const getCartItemRupee = (item) => {
    const price = Number(item.price || 0);
    const discount = Number(item.discountPercentage || 0);
    return price * (1 - discount / 100) * 20;
  };

  const handleCheckoutItem = () => {
    setLoader(true);
    setTimeout(() => {
      navigate("/cart/checkout/payment");
      localStorage.setItem("total", totalAmount);
    }, 2000);
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
            {(showAllCart ? addedItems : addedItems.slice(0,4)).map((item) => {
              const itemUnitRupee = getCartItemRupee(item);

              return (
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
                        ₹{itemUnitRupee.toFixed(2)}
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
                      ₹{(itemUnitRupee * item.quantity).toFixed(2)}
                    </div>
                    <button 
                      onClick={() =>  deleteCart(item)} 
                      className="remove-item-btn"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}
{
  addedItems.length > 4 && (

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "1rem"
      }}
    >

      <button

        onClick={() =>
          setShowAllCart(!showAllCart)
        }

        style={{

          padding: "12px 20px",

          border: "none",

          borderRadius: "12px",

          background: "var(--gradient)",

          color: "#fff",

          fontWeight: "600",

          cursor: "pointer",

          boxShadow:
            "0 8px 20px rgba(0,0,0,0.08)",

          transition: "0.3s"

        }}

      >

        {
          showAllCart
            ? "Show Less"
            : `Load More (${addedItems.length - 4}+ Items)`
        }

      </button>

    </div>
  )
}
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
                <span>₹{totalAmount}</span>
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