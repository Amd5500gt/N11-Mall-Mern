import React, { useEffect, useState } from 'react';
import { FaCartPlus, FaHeart, FaRegHeart, FaEye, FaSearch } from "react-icons/fa";
import { BsFillCartCheckFill, BsStar, BsStarHalf, BsStarFill, BsLightningCharge, BsEmojiFrown } from "react-icons/bs";
import { Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import { useSearch } from '../../context/SearchContext';
import NoProductsFound from './ProductNotFound';
import { handleSuccess } from '../../utils/Utils';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import BASE_URL from '../../config/config';
import '../pages.css';
import Spinner from '../../components/ui/Spinner';
const Products = () => {
  const[skip,setSkip] = useState(0)
  const [addedItemId, setAddedItemId] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const {searchTerm,setSearchTerm,data,setData,filterData,setFilterData,loading,setLoading,total,setTotal,limit} = useSearch();
  const { newCart, removeCart, addedItems } = useCart();
  const visibleData = Array.isArray(filterData)
  ? filterData.slice(skip, skip + limit)
  : [];
useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, [skip]);
  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist_n11');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('wishlist_n11', JSON.stringify(wishlist));
  }, [wishlist]);
useEffect(() => {
  const value = searchTerm.toLowerCase();

  if (!value) {
    setFilterData(data);
    setTotal(data.length);
    return;
  }

  const result = data.filter(item =>
    item.title?.toLowerCase().includes(value)
  );

  setFilterData(result);
  setTotal(result.length);
  setSkip(0);

}, [searchTerm, data]);

  // Render stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return (
      <>
        {[...Array(fullStars)].map((_, i) => <BsStarFill key={`f${i}`} className="star-filled" />)}
        {hasHalfStar && <BsStarHalf className="star-half" />}
        {[...Array(emptyStars)].map((_, i) => <BsStar key={`e${i}`} className="star-empty" />)}
      </>
    );
  };

const handleAddToCart = async (item) => {
  try {
    // ✅ UI update bhi rakho
    newCart(item);

    setAddedItemId(item.id);

    setTimeout(() => setAddedItemId(null), 500);
  } catch (err) {
    console.log(err);
  }
};

  // Wishlist toggle
  const handleWishlist = (itemId) => {
    setWishlist(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  // Format price to INR
  const formatPrice = (price) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price * 20);
  
  // Pagination
  const handleNext = () => { if (skip + limit < total) setSkip(p => p + limit); };
  const handlePrev = () => { if (skip > 0) setSkip(p => p - limit); };
  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit);



  // Loading Skeleton
  if (loading) {
    return (
      <div className="products-page">
        <div className="loading-skeleton-container">
          <div className="skeleton-hero"></div>
          <div style={{ padding: '3rem 0' }}>
            <div className="products-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="product-card skeleton-card">
                  <div className="skeleton-image shimmer"></div>
                  <div className="skeleton-info">
                    <div className="skeleton-title shimmer"></div>
                    <div className="skeleton-rating shimmer"></div>
                    <div className="skeleton-price shimmer"></div>
                    <div className="skeleton-button shimmer"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">

      {/* ── Hero Banner ── */}
      {skip === 0 && total > 0 && (
        <div className="products-hero-banner">
          {/* Background watermark text */}
          <div className="hero-watermark" aria-hidden="true">SHOP</div>

          <div className="hero-content">
            <div className="hero-left">
              <div className="hero-badge">
                <BsLightningCharge />
                <span>Summer Sale 2026</span>
              </div>
              <h1 className="hero-title">
                Choose.<br /><em>Buy.</em><br />Enjoy.
              </h1>
              <p className="hero-subtitle">
                Curated products at unbeatable prices — with free shipping on every order you place.
              </p>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">4.8★</span>
                <span className="stat-label">Avg. Rating</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Products Grid ── */}
      <div className="products-container">
        <div className="products-header">
          <h2>{skip === 0 && total > 0 ? 'Featured Products' : total > 0 ? 'All Products' : ''}</h2>
          {total > 0 && (
            <p>Showing {skip + 1}–{Math.min(skip + limit, total)} of {total} products</p>
          )}
        </div>

        {total === 0 ? (
          <NoProductsFound />
        ) : (
          <>
            <div className="products-grid">
              {visibleData.map((item, index) => (
                <div
                  key={item.id}
                  className="product-card"
                  style={{ animationDelay: `${(index % 12) * 0.05}s` }}
                >
                  
                  {/* Image */}
                  <div className="product-image-section">
                    <Link to={`/product/${item.id}`} className="product-link">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="product-img"
                        loading="lazy"
                      />
                      <div className="product-overlay">
                        <FaEye className="overlay-icon" />
                        <span>Quick View</span>
                      </div>
                    </Link>

                    {item.discountPercentage > 1 && (
                      <div className="discount-badge">-{Math.round(item.discountPercentage)}%</div>
                    )}

                    <button
                      className={`wishlist-btn ${wishlist.includes(item.id) ? 'active' : ''}`}
                      onClick={() => handleWishlist(item.id)}
                      aria-label="Wishlist"
                    >
                      {wishlist.includes(item.id) ? <FaHeart /> : <FaRegHeart />}
                    </button>

                    {item.stock <= 5 && item.stock > 0 && (
                      <div className="low-stock-badge">Only {item.stock} left</div>
                    )}
                    {item.stock === 0 && (
                      <div className="out-stock-badge">Out of Stock</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="product-info-section">
                    <Link to={`/product/${item.id}`} className="product-title-link">
                      <h3 className="product-title">{item.title}</h3>
                    </Link>

                    {item.brand && (
                      <span className="product-brand">{item.brand}</span>
                    )}

                    <div className="product-rating">
                      <div className="stars">{renderStars(item.rating)}</div>
                      <span className="rating-count">({item.rating})</span>
                      {item.reviews && (
                        <span className="reviews-count">{item.reviews.length} reviews</span>
                      )}
                    </div>

                    <div className="product-pricing">
                      <span className="current-price">
                        {formatPrice(item.price * (1 - item.discountPercentage / 100))}
                      </span>
                      {item.discountPercentage > 1 && (
                        <>
                          <span className="original-price">{formatPrice(item.price)}</span>
                          <span className="save-price">
                            Save {formatPrice(item.price * item.discountPercentage / 100)}
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() =>{
                     handleAddToCart(item)
                   
                      }}
                      className={`add-to-cart-btn ${addedItemId === item.id ? 'added' : ''}`}
                      disabled={item.stock === 0}
                    >
                      {addedItemId === item.id ? (
                        <><BsFillCartCheckFill /><span> <Spinner/> </span></>
                      ) : (
                        <><FaCartPlus /><span>Add to Cart</span></>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-wrapper">
                <div className="pagination">
                  <button onClick={handlePrev} disabled={skip === 0} className="page-btn prev-btn">
                    ← Prev
                  </button>

                  <div className="page-numbers">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) pageNum = i + 1;
                      else if (currentPage <= 3) pageNum = i + 1;
                      else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                      else pageNum = currentPage - 2 + i;

                      if (pageNum <= totalPages && pageNum > 0) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setSkip((pageNum - 1) * limit)}
                            className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button onClick={handleNext} disabled={skip + limit >= total} className="page-btn next-btn">
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;