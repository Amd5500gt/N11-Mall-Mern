import React from 'react'
import { useSearch } from '../../context/SearchContext'
import { BsEmojiFrown } from "react-icons/bs"
import { FaSearch } from "react-icons/fa"
import "../pages.css"
  const NoProductsFound = () => {

 const {searchTerm,setSearchTerm} = useSearch()
  
  return(
    <div className="no-products-found">
      <div className="no-products-animation">
        <BsEmojiFrown className="no-products-icon" />
        <FaSearch className="search-icon-animated" />
      </div>
      <h3>No Products Found</h3>
      <p>
        {searchTerm 
          ? `We couldn't find any products matching "${searchTerm}"` 
          : "No products are available at the moment"}
      </p>
      {searchTerm && (
        <button 
          className="clear-search-btn"
          onClick={() => {
            setSearchTerm('');
          }}
        >
          Clear Search
        </button>
      )}
      <div className="suggestions">
        <span>Try:</span>
        <button onClick={() => setSearchTerm('phone')}>Phones</button>
        <button onClick={() => setSearchTerm('laptop')}>Laptops</button>
        <button onClick={() => setSearchTerm('watch')}>Watches</button>
      </div>
    </div>
  );
}
export default NoProductsFound