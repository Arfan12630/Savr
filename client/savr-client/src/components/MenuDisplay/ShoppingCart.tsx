import { useState } from 'react';
import './ShoppingCart.css';
import { useShoppingCart } from './ShoppingCartContext';

const ShoppingCart = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    clearItems,
    getTotalItems,
    getTotalPrice,
  } = useShoppingCart();
  const [isOpen, setIsOpen] = useState(false);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckout = () => {
    console.log('Checkout clicked');
  };

  return (
    <div className="shopping-cart-container">
      <div
        className="cart-icon"
        onClick={toggleCart}>
        <span className="material-icons"></span>
        {getTotalItems() > 0 && (
          <span className="cart-badge">{getTotalItems()}</span>
        )}
      </div>

      {isOpen && (
        <div className="cart-dropdown">
          <div className="cart-header">
            <h3>Your Cart</h3>
            <button
              className="close-cart"
              onClick={toggleCart}>
              ×
            </button>
          </div>

          {items.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="cart-item">
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      {item.selectedOption && (
                        <p className="item-option">{item.selectedOption}</p>
                      )}
                      <p className="item-price">{item.price}</p>
                    </div>
                    <div className="item-actions">
                      <button
                        onClick={() =>
                          updateQuantity(item, (item.quantity || 1) - 1)
                        }
                        className="quantity-btn">
                        -
                      </button>
                      <span className="item-quantity">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item, (item.quantity || 1) + 1)
                        }
                        className="quantity-btn">
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item)}
                        className="remove-btn">
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="cart-actions">
                  <button
                    onClick={clearItems}
                    className="clear-cart-btn">
                    Clear Cart
                  </button>
                  <button
                    className="checkout-btn"
                    onClick={handleCheckout}>
                    Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
