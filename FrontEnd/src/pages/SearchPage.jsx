import React, {
  useEffect,
  useState
} from "react";

import {
  useLocation,
  Link
} from "react-router-dom";

import {
  FaEye,
  FaHeart,
  FaRegHeart,
  FaCartPlus
} from "react-icons/fa";

import {
  BsStarFill,
  BsStarHalf,
  BsStar,
  BsFillCartCheckFill
} from "react-icons/bs";

import {
  useSearch
} from "../context/SearchContext";

import {
  useCart
} from "../context/CartContext";

const SearchPage = () => {

  const { data } =
    useSearch();

  const {
    newCart
  } = useCart();

  const location =
    useLocation();

  const [
    results,
    setResults
  ] = useState([]);

  const [
    query,
    setQuery
  ] = useState("");
const [skip, setSkip] =
  useState(0);

const limit = 12;
  const [
    wishlist,
    setWishlist
  ] = useState([]);

  const [
    addedItemId,
    setAddedItemId
  ] = useState(null);
useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, [results, skip]);

const visibleData =
  results.slice(
    skip,
    skip + limit
  );

const currentPage =
  Math.floor(skip / limit) + 1;

const totalPages =
  Math.ceil(
    results.length / limit
  );
  useEffect(() => {

    const params =
      new URLSearchParams(
        location.search
      );

    const q =
      params.get("q") || "";

    setQuery(q);

    const filtered =
      data.filter((item) =>

        item.title
          ?.toLowerCase()
          .includes(
            q.toLowerCase()
          )

      );

    setResults(filtered);
    setSkip(0);

  }, [location.search, data]);

  const handleWishlist =
    (id) => {

      setWishlist((prev) =>

        prev.includes(id)

          ? prev.filter(
              (item) =>
                item !== id
            )

          : [...prev, id]

      );

    };

  const handleAddToCart =
    (item) => {

      newCart(item);

      setAddedItemId(
        item.id
      );

      setTimeout(() => {

        setAddedItemId(null);

      }, 700);

    };

  const renderStars =
    (rating) => {

      const fullStars =
        Math.floor(rating);

      const hasHalfStar =
        rating % 1 >= 0.5;

      const emptyStars =
        5 -
        fullStars -
        (hasHalfStar ? 1 : 0);

      return (

        <>

          {
            [...Array(fullStars)]
            .map((_, i) => (

              <BsStarFill
                key={i}
                className="
                star-filled"
              />

            ))
          }

          {
            hasHalfStar && (

              <BsStarHalf
                className="
                star-half"
              />

            )
          }

          {
            [...Array(emptyStars)]
            .map((_, i) => (

              <BsStar
                key={i}
                className="
                star-empty"
              />

            ))
          }

        </>

      );

    };

  const formatPrice =
    (price) =>

      new Intl.NumberFormat(
        "en-IN",
        {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 0,
        }
      ).format(price * 20);

  return (

    <div
      className="
      products-page"
    >

      <div
        className="
        products-container"
      >

        <div
          className="
          products-header"
        >

          <h2>

            Search Results
            for "{query}"

          </h2>

          <p>

           <b> {results.length}</b> 
             products found

          </p>

        </div>

        {
          results.length === 0

          ? (

            <div
              className="
              no-search-results"
            >

              <h3>
                No Products Found
              </h3>

            </div>

          )

          : (

     <div className="products-grid">
              { visibleData.map((item, index) => (
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

          )
        }
{
  totalPages > 1 && (

    <div
      className="
      pagination-wrapper"
    >

      <div
        className="
        pagination"
      >

        <button

          onClick={() =>
            setSkip((prev) =>
              Math.max(
                prev - limit,
                0
              )
            )
          }

          disabled={skip === 0}

          className="
          page-btn
          prev-btn"
        >

          ← Prev

        </button>

        <div
          className="
          page-numbers"
        >

          {
            [...Array(totalPages)]
            .map((_, i) => {

              const page =
                i + 1;

              return (

                <button
                  key={page}

                  onClick={() =>
                    setSkip(
                      (page - 1)
                      * limit
                    )
                  }

                  className={`
                  page-number
                  ${
                    currentPage
                    === page
                    ? "active"
                    : ""
                  }
                  `}
                >

                  {page}

                </button>

              );

            })
          }

        </div>

        <button

          onClick={() =>
            setSkip((prev) =>

              Math.min(
                prev + limit,

                (totalPages - 1)
                * limit
              )

            )
          }

          disabled={
            skip + limit >=
            results.length
          }

          className="
          page-btn
          next-btn"
        >

          Next →

        </button>

      </div>

    </div>

  )
}
      </div>

    </div>

  );

};

export default SearchPage;