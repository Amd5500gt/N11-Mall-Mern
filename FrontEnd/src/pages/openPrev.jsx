import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loader from '../components/common/Loader';
import { FaCartPlus, FaCheck, FaMinus, FaPlus, FaHeart, FaShare, FaTruck, FaShieldAlt, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { BsFillCartCheckFill, BsStar, BsStarHalf, BsStarFill, BsLightningCharge } from "react-icons/bs";
import ErrorPage from '../ErrorPage';
import './pages.css';
import { useCart } from '../Context/CartContext';
 import BASE_URL from "../config/config";
const OpenPrev = () => {
  const { id } = useParams();
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState(null);
  const{newCart, addWithQuantity} = useCart()

  useEffect(() => {
    let timer = setTimeout(() => {
      setError(true);
      setLoading(false);
    }, 6000);

    fetch(`${BASE_URL}/product/${id}`)
      .then(res => res.json())
      .then(data => {
        clearTimeout(timer);
        setItem(data);
        setActiveImage(data.thumbnail);
        setLoading(false);
      })
      .catch((err) => {
        clearTimeout(timer);
        setError(true);
        setLoading(false);
        console.log(err);
      });
  }, [id]);

  const increaseQuantity = () => {
    if (quantity < item.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = (product) => {
    const productWithQuantity = { ...product, quantity: quantity };
    addWithQuantity(productWithQuantity);
    setIsAdded(true);
    setShowToast(true);
        setToastProduct(product);
    setTimeout(() => {
      setIsAdded(false);
    }, 500);
      setTimeout(() => { setShowToast(false); setToastProduct(null); }, 3000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price * 20);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="stars">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="star-filled" />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="star-half" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="star-empty" />
        ))}
      </div>
    );
  };

  if (loading) return <Loader />;
  if (error) return <ErrorPage />;
  if (!item || item.id != id) return <ErrorPage />;

  return (
    <div className="pages-container">
      <div className="product-detail-page">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span className="current">{item.title}</span>
        </div>

        <div className="product-detail-layout">
          {/* Left - Image Gallery */}
          <div className="product-gallery">
            <div className="main-image-wrapper">
              <img src={activeImage} alt={item.title} className="main-image" />
              <button 
                className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <FaHeart />
              </button>
            </div>
            {item.images && item.images.length > 1 && (
              <div className="thumbnail-list">
                <img 
                  src={item.thumbnail} 
                  alt="thumbnail" 
                  className={`thumbnail ${activeImage === item.thumbnail ? 'active' : ''}`}
                  onClick={() => setActiveImage(item.thumbnail)}
                />
                {item.images.slice(0, 3).map((img, idx) => (
                  <img 
                    key={idx}
                    src={img} 
                    alt={`product ${idx}`} 
                    className={`thumbnail ${activeImage === img ? 'active' : ''}`}
                    onClick={() => setActiveImage(img)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right - Product Info */}
          <div className="product-info-detail">
            <div className="product-header">
              {item.brand && <span className="product-brand">{item.brand}</span>}
              <h1 className="product-title-detail">{item.title}</h1>
            </div>

            {/* Rating */}
            <div className="rating-section">
              {renderStars(item.rating)}
              <span className="rating-value">{item.rating} / 5</span>
              <span className="review-count">({item.reviews?.length || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="price-section">
              <div className="price-box">
                <span className="current-price">{formatPrice(item.price * (1 - item.discountPercentage / 100))}</span>
                <span className="original-price">{formatPrice(item.price)}</span>
              </div>
            </div>

            {/* Stock Status */}
            <div className={`stock-status ${item.stock > 0 ? 'in-stock' : 'out-stock'}`}>
              {item.stock > 0 ? (
                <>
                  <div className="stock-indicator"></div>
                  <span>In Stock ({item.stock} items left)</span>
                </>
              ) : (
                <span>Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <p className="product-description">{item.description}</p>

            {/* Quantity Selector */}
            {item.stock > 0 && (
              <div className="quantity-section">
                <label>Quantity:</label>
                <div className="quantity-selector">
                  <button onClick={decreaseQuantity} disabled={quantity <= 1} className="qty-btn">
                    <FaMinus />
                  </button>
                  <span className="qty-number">{quantity}</span>
                  <button onClick={increaseQuantity} disabled={quantity >= item.stock} className="qty-btn">
                    <FaPlus />
                  </button>
                </div>
                <span className="stock-warning">
                  {item.stock <= 10 && `Only ${item.stock} left! Order soon.`}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
                onClick={() => handleAddToCart(item)}
                disabled={item.stock === 0}
              >
                {isAdded ? (
                  <><FaCheck /> Added to Cart</>
                ) : (
                  <><FaCartPlus /> Add to Cart</>
                )}
              </button>
              <button className="share-btn">
                <FaShare /> Share
              </button>
            </div>

            {/* Delivery & Warranty Info */}
            <div className="delivery-info">
              {item.shippingInformation && (
                <div className="info-card">
                  <FaTruck className="info-icon" />
                  <div>
                    <strong>Free Shipping</strong>
                    <p>{item.shippingInformation}</p>
                  </div>
                </div>
              )}
              {item.warrantyInformation && (
                <div className="info-card">
                  <FaShieldAlt className="info-icon" />
                  <div>
                    <strong>Warranty</strong>
                    <p>{item.warrantyInformation}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="product-tabs">
          <div className="tab-headers">
            <button className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>
              Product Details
            </button>
            <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
              Customer Reviews
            </button>
            <button className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`} onClick={() => setActiveTab('shipping')}>
              Shipping Info
            </button>
          </div>
          <div className="tab-content">
            {activeTab === 'details' && (
              <div className="details-tab">
                <h3>Product Specifications</h3>
                <ul className="specs-list">
                  <li><strong>Category:</strong> {item.category}</li>
                  <li><strong>Brand:</strong> {item.brand}</li>
                  <li><strong>SKU:</strong> {item.sku || 'N/A'}</li>
                  <li><strong>Weight:</strong> {item.weight || 'N/A'}</li>
                  <li><strong>Dimensions:</strong> {item.dimensions?.width || 'N/A'} x {item.dimensions?.height || 'N/A'} x {item.dimensions?.depth || 'N/A'}</li>
                </ul>
                <h3>Description</h3>
                <p>{item.description}</p>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="reviews-tab">
                <div className="rating-summary">
                  <div className="average-rating">
                    <span className="avg-number">{item.rating}</span>
                    {renderStars(item.rating)}
                    <span>Based on {item.reviews?.length || 0} reviews</span>
                  </div>
                </div>
                {item.reviews && item.reviews.length > 0 ? (
                  item.reviews.map((review, idx) => (
                    <div key={idx} className="review-card">
                      <div className="review-header">
                        <strong>{review.reviewerName}</strong>
                        <span>{renderStars(review.rating)}</span>
                      </div>
                      <p>{review.comment}</p>
                      <small>{new Date(review.date).toLocaleDateString()}</small>
                    </div>
                  ))
                ) : (
                  <p>No reviews yet. Be the first to review!</p>
                )}
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="shipping-tab">
                <h3>Shipping Information</h3>
                <p>{item.shippingInformation || 'Free shipping on all orders!'}</p>
                <h3>Return Policy</h3>
                <p>{item.returnPolicy || '30 days return policy with full refund'}</p>
                <h3>Warranty</h3>
                <p>{item.warrantyInformation || '1 year manufacturer warranty'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
            {/* Toast */}
            {showToast && toastProduct && (
              <div className="toast-notification">
                <div className="toast-content">
                  <div className="toast-image">
                    <img src={toastProduct.thumbnail} alt={toastProduct.title} />
                  </div>
                  <div className="toast-details">
                    <div className="toast-title">{toastProduct.title}</div>
                    <div className="toast-message">
                      <BsFillCartCheckFill className="toast-icon" />
                      Added to cart
                    </div>
                  </div>
                </div>
              </div>
            )}
    </div>
  );
};

export default OpenPrev;