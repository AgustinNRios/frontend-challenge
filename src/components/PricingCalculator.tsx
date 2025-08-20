import { useState } from 'react'
import { Product } from '../types/Product'
import './PricingCalculator.css'
import { formatPrice } from '../helpers/FormatPrice'
import QuoteSimulator from './QuoteSimulator'

interface PricingCalculatorProps {
  product: Product
}

const PricingCalculator = ({ product }: PricingCalculatorProps) => {
  const [quantity, setQuantity] = useState<number>(product.stock > 0 ? 1 : 0)
  const [selectedBreak, setSelectedBreak] = useState<number>(0)
  const [showQuoteSimulator, setShowQuoteSimulator] = useState<boolean>(false)

  // Find the best applicable price break for a given quantity
  const findBestBreakIndex = (qty: number) => {
    if (!product.priceBreaks || product.priceBreaks.length === 0) return 0
    
    let bestIndex = 0
    for (let i = 0; i < product.priceBreaks.length; i++) {
      if (qty >= product.priceBreaks[i].minQty) {
        bestIndex = i
      }
    }
    return bestIndex
  }

  // Calculate best pricing for quantity
  const calculatePrice = (qty: number) => {
    if (!product.priceBreaks || product.priceBreaks.length === 0) {
      return product.basePrice * qty
    }

    // Find applicable price break
    let applicableBreak = product.priceBreaks[0]
    for (let i = 0; i < product.priceBreaks.length; i++) {
      if (qty >= product.priceBreaks[i].minQty) {
        applicableBreak = product.priceBreaks[i]
      }
    }

    return applicableBreak.price * qty
  }

  // Calculate discount amount
  const getDiscount = (qty: number) => {
    if (!product.priceBreaks || product.priceBreaks.length === 0) {
      return 0
    }

    const baseTotal = product.basePrice * qty
    const discountedTotal = calculatePrice(qty)
    
    // Calculate savings percentage
    return ((baseTotal - discountedTotal) / baseTotal) * 100
  }

  const currentPrice = calculatePrice(quantity)
  const discountPercent = getDiscount(quantity)

  return (
    <div className="pricing-calculator">
      <div className="calculator-header">
        <h3 className="calculator-title p1-medium">Calculadora de Precios</h3>
        <p className="calculator-subtitle l1">
          Calcula el precio según la cantidad que necesitas
        </p>
      </div>

      <div className="calculator-content">
        {/* Quantity Input */}
        <div className="quantity-section">
          <label className="quantity-label p1-medium">Cantidad</label>
          <div className="quantity-input-group">
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0
                const maxStock = product.stock || 0
                const newQuantity = Math.max(0, Math.min(value, maxStock))
                setQuantity(newQuantity)
                setSelectedBreak(findBestBreakIndex(newQuantity))
              }}
              className="quantity-input p1"
              min="0"
              max={product.stock || 0}
              disabled={!product.stock || product.stock === 0}
            />
            <span className="quantity-unit l1">unidades</span>
          </div>
        </div>

        {/* Price Breaks */}
        {product.priceBreaks && product.priceBreaks.length > 0 && (
          <div className="price-breaks-section">
            <h4 className="breaks-title p1-medium">Descuentos por volumen</h4>
            <div className="price-breaks">
              {product.priceBreaks.map((priceBreak, index) => {
                const isActive = quantity >= priceBreak.minQty
                const isSelected = selectedBreak === index
                
                return (
                  <div 
                    key={index}
                    className={`price-break ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedBreak(index)
                      const requestedQty = priceBreak.minQty
                      const maxStock = product.stock || 0
                      setQuantity(Math.min(requestedQty, maxStock))
                    }}
                  >
                    <div className="break-quantity l1">
                      {priceBreak.minQty}+ unidades
                    </div>
                    <div className="break-price p1-medium">
                      {formatPrice(priceBreak.price)}
                    </div>
                    {priceBreak.discount && (
                      <div className="break-discount l1">
                        -{priceBreak.discount}%
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Price Summary */}
        <div className="price-summary">
          <div className="summary-row">
            <span className="summary-label p1">Precio unitario:</span>
            <span className="summary-value p1-medium">
              {quantity > 0 ? formatPrice(calculatePrice(quantity) / quantity) : 
                (selectedBreak > 0 && product.priceBreaks && product.priceBreaks[selectedBreak] ? 
                formatPrice(product.priceBreaks[selectedBreak].price) : 
                formatPrice(product.basePrice))}
            </span>
          </div>
          
          <div className="summary-row">
            <span className="summary-label p1">Cantidad:</span>
            <span className="summary-value p1-medium">{quantity} unidades</span>
          </div>

          {discountPercent > 0 && (
            <div className="summary-row discount-row">
              <span className="summary-label p1">Descuento:</span>
              <span className="summary-value discount-value p1-medium">
                -{discountPercent.toFixed(1)}%
              </span>
            </div>
          )}

          <div className="summary-row total-row">
            <span className="summary-label p1-medium">Total:</span>
            <span className="summary-value total-value h2">
              {formatPrice(currentPrice)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="calculator-actions">
          <button 
            className="btn btn-secondary cta1"
            onClick={() => setShowQuoteSimulator(true)}
          >
            <span className="material-icons">email</span>
            Solicitar cotización oficial
          </button>
          
          <button 
            className="btn btn-primary cta1"
            onClick={() => {
              // Add to cart functionality
              alert('Función de agregar al carrito por implementar')
            }}
          >
            <span className="material-icons">shopping_cart</span>
            Agregar al carrito
          </button>
        </div>

        {/* Additional Info */}
        <div className="additional-info">
          <div className="info-item">
            <span className="material-icons">local_shipping</span>
            <div className="info-content">
              <span className="info-title l1">Envío gratis</span>
              <span className="info-detail l1">En pedidos sobre $50.000</span>
            </div>
          </div>
          
          <div className="info-item">
            <span className="material-icons">schedule</span>
            <div className="info-content">
              <span className="info-title l1">Tiempo de producción</span>
              <span className="info-detail l1">7-10 días hábiles</span>
            </div>
          </div>
          
          <div className="info-item">
            <span className="material-icons">verified</span>
            <div className="info-content">
              <span className="info-title l1">Garantía</span>
              <span className="info-detail l1">30 días de garantía</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Simulator Modal */}
      {showQuoteSimulator && (
        <QuoteSimulator 
          product={product}
          initialQuantity={quantity}
          onClose={() => setShowQuoteSimulator(false)}
        />
      )}
    </div>
  )
}

export default PricingCalculator