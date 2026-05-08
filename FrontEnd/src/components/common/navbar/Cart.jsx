import React from 'react'
import { Link } from 'react-router-dom'
import { BsCartFill } from 'react-icons/bs';
const Cart = ({cartCount,animate}) => {
  return (
    <div>
             <Link to="/cart" className="cart-button">
                <div className="cart-icon-wrapper">
                  <BsCartFill className='cart-icon' />
                  {cartCount > 0 && (
                    <span className={`cart-badge ${animate ? 'animate' : ''}`}>
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="cart-text">Cart</span>
              </Link>
    </div>
  )
}

export default Cart