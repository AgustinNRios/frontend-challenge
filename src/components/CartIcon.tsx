import { useState } from 'react'
import { useCartStore } from '../store/cartStore'
import './CartIcon.css'

const CartIcon = () => {
  const { totalItems, items } = useCartStore()
  const [isOpen, setIsOpen] = useState(false)

  const toggleCart = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="cart-icon-container">
      <button 
        className="cart-icon-button"
        onClick={toggleCart}
        aria-label={`Carrito de compras con ${totalItems} items`}
      >
        <span className="material-icons">shopping_cart</span>
        Carrito 
        {totalItems > 0 && (
          <span className="cart-badge">{totalItems}</span>
        )}
      </button>

      {/* Mini Cart Dropdown */}
      {isOpen && (
        <div className="cart-dropdown">
          <div className="cart-dropdown-header">
            <h3 className="p1-medium">Carrito</h3>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              <span className="material-icons">close</span>
            </button>
          </div>

          <div className="cart-dropdown-content">
            {items.length === 0 ? (
              <div className="empty-cart">
                <span className="material-icons">shopping_cart</span>
                <p className="p1">Tu carrito está vacío</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {items.slice(0, 3).map((item) => (
                    <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="cart-item-mini">
                      <div className="item-info">
                        <h4 className="item-name l1">{item.name}</h4>
                        <p className="item-details l1">
                          {item.selectedColor && `Color: ${item.selectedColor}`}
                          {item.selectedSize && ` • Talla: ${item.selectedSize}`}
                        </p>
                        <p className="item-quantity l1">Cantidad: {item.quantity}</p>
                      </div>
                      <div className="item-price p1-medium">
                        ${(item.unitPrice * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                  
                  {items.length > 3 && (
                    <p className="more-items l1">+{items.length - 3} productos más</p>
                  )}
                </div>

                <div className="cart-actions">
                  <button 
                    className="btn btn-primary cta1"
                    onClick={() => {
                      setIsOpen(false)
                      // Navigate to cart page
                      window.location.href = '/cart'
                    }}
                  >
                    Ver carrito completo
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CartIcon
