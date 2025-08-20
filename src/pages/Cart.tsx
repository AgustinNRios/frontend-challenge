import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { formatPrice } from '../helpers/FormatPrice'
import './Cart.css'

const Cart = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart-state">
            <span className="material-icons">shopping_cart</span>
            <h1 className="h2">Tu carrito está vacío</h1>
            <p className="p1">Agrega productos a tu carrito para comenzar tu compra</p>
            <Link to="/" className="btn btn-primary cta1">
              <span className="material-icons">arrow_back</span>
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="h2">Carrito de Compras</h1>
          <p className="p1">{totalItems} productos en tu carrito</p>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {items.map((item) => (
              <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="cart-item">
                <div className="item-image">
                  <div className="image-placeholder">
                    <span className="material-icons">image</span>
                  </div>
                </div>

                <div className="item-details">
                  <div className="item-header">
                    <h3 className="item-name p1-medium">{item.name}</h3>
                    <p className="item-sku l1">SKU: {item.sku}</p>
                  </div>

                  <div className="item-options">
                    {item.selectedColor && (
                      <span className="option l1">Color: {item.selectedColor}</span>
                    )}
                    {item.selectedSize && (
                      <span className="option l1">Talla: {item.selectedSize}</span>
                    )}
                  </div>

                  <div className="item-price">
                    <span className="unit-price l1">
                      {formatPrice(item.unitPrice)} c/u
                    </span>
                    <span className="total-price p1-medium">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>

                <div className="item-controls">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="quantity-btn"
                      disabled={item.quantity <= 1}
                    >
                      <span className="material-icons">remove</span>
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="quantity-btn"
                      disabled={item.quantity >= item.stock}
                    >
                      <span className="material-icons">add</span>
                    </button>
                  </div>

                  <button 
                    onClick={() => removeItem(item.id)}
                    className="remove-btn"
                    aria-label="Eliminar producto"
                  >
                    <span className="material-icons">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3 className="summary-title p1-medium">Resumen del pedido</h3>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span className="label l1">Productos ({totalItems})</span>
                  <span className="value p1">{formatPrice(totalPrice)}</span>
                </div>
                
                <div className="summary-row">
                  <span className="label l1">Envío</span>
                  <span className="value p1">Gratis</span>
                </div>
                
                <div className="summary-row total-row">
                  <span className="label p1-medium">Total</span>
                  <span className="value h3">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="summary-actions">
                <button className="btn btn-primary cta1 checkout-btn">
                  <span className="material-icons">payment</span>
                  Proceder al pago
                </button>
                
                <button 
                  onClick={clearCart}
                  className="btn btn-secondary l1"
                >
                  Vaciar carrito
                </button>
              </div>
            </div>

            <div className="continue-shopping">
              <Link to="/" className="continue-link l1">
                <span className="material-icons">arrow_back</span>
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
