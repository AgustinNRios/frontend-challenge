import { useState } from 'react'
import { Product } from '../types/Product'
import { formatPrice } from '../helpers/FormatPrice'
import './QuoteSimulator.css'

interface QuoteSimulatorProps {
  product: Product
  initialQuantity?: number
  onClose: () => void
}

interface CompanyData {
  companyName: string
  contactName: string
  email: string
  phone: string
  rut: string
  address: string
  city: string
  region: string
}

interface QuoteCalculation {
  quantity: number
  unitPrice: number
  subtotal: number
  volumeDiscount: number
  companyDiscount: number
  shipping: number
  taxes: number
  total: number
}

const QuoteSimulator = ({ product, initialQuantity = 1, onClose }: QuoteSimulatorProps) => {
  const [step, setStep] = useState<'form' | 'calculation' | 'summary'>('form')
  const [quantity, setQuantity] = useState<number>(initialQuantity)
  const [companyData, setCompanyData] = useState<CompanyData>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    rut: '',
    address: '',
    city: '',
    region: ''
  })

  // Calculate pricing with all discounts
  const calculateQuote = (): QuoteCalculation => {
    // Find best price break
    let unitPrice = product.basePrice
    let volumeDiscount = 0

    if (product.priceBreaks && product.priceBreaks.length > 0) {
      for (let i = product.priceBreaks.length - 1; i >= 0; i--) {
        if (quantity >= product.priceBreaks[i].minQty) {
          unitPrice = product.priceBreaks[i].price
          volumeDiscount = ((product.basePrice - unitPrice) / product.basePrice) * 100
          break
        }
      }
    }

    const subtotal = unitPrice * quantity

    // Company discount based on quantity tiers
    let companyDiscount = 0
    if (quantity >= 1000) companyDiscount = 15
    else if (quantity >= 500) companyDiscount = 10
    else if (quantity >= 100) companyDiscount = 5

    const discountAmount = (subtotal * companyDiscount) / 100
    const afterDiscount = subtotal - discountAmount

    // Shipping calculation
    let shipping = 0
    if (afterDiscount < 50000) {
      shipping = quantity <= 50 ? 5000 : quantity <= 200 ? 15000 : 25000
    }

    // Taxes (19% IVA)
    const taxes = (afterDiscount + shipping) * 0.19
    const total = afterDiscount + shipping + taxes

    return {
      quantity,
      unitPrice,
      subtotal,
      volumeDiscount,
      companyDiscount,
      shipping,
      taxes,
      total
    }
  }

  const quote = calculateQuote()

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('calculation')
  }

  const handleInputChange = (field: keyof CompanyData, value: string) => {
    setCompanyData(prev => ({ ...prev, [field]: value }))
  }

  const generateExportData = () => {
    const quoteData = {
      fecha: new Date().toLocaleDateString('es-CL'),
      empresa: companyData,
      producto: {
        nombre: product.name,
        sku: product.sku,
        categoria: product.category
      },
      cotizacion: quote,
      condiciones: {
        validez: '30 días',
        tiempoProduccion: '7-10 días hábiles',
        garantia: '30 días',
        formaPago: 'Transferencia bancaria o cheque'
      }
    }
    return quoteData
  }

  const exportToPDF = () => {
    const data = generateExportData()
    const content = `
COTIZACIÓN OFICIAL

Fecha: ${data.fecha}
Válida por: ${data.condiciones.validez}

DATOS DE LA EMPRESA:
${data.empresa.companyName}
RUT: ${data.empresa.rut}
Contacto: ${data.empresa.contactName}
Email: ${data.empresa.email}
Teléfono: ${data.empresa.phone}
Dirección: ${data.empresa.address}, ${data.empresa.city}, ${data.empresa.region}

PRODUCTO:
${data.producto.nombre} (SKU: ${data.producto.sku})
Categoría: ${data.producto.categoria}

DETALLE DE COTIZACIÓN:
Cantidad: ${data.cotizacion.quantity} unidades
Precio unitario: ${formatPrice(data.cotizacion.unitPrice)}
Subtotal: ${formatPrice(data.cotizacion.subtotal)}
${data.cotizacion.volumeDiscount > 0 ? `Descuento por volumen: -${data.cotizacion.volumeDiscount.toFixed(1)}%\n` : ''}
${data.cotizacion.companyDiscount > 0 ? `Descuento empresarial: -${data.cotizacion.companyDiscount}%\n` : ''}
Envío: ${formatPrice(data.cotizacion.shipping)}
IVA (19%): ${formatPrice(data.cotizacion.taxes)}
TOTAL: ${formatPrice(data.cotizacion.total)}

CONDICIONES:
- Tiempo de producción: ${data.condiciones.tiempoProduccion}
- Garantía: ${data.condiciones.garantia}
- Forma de pago: ${data.condiciones.formaPago}
    `

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cotizacion_${data.empresa.companyName.replace(/\s+/g, '_')}_${data.fecha.replace(/\//g, '-')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportToJSON = () => {
    const data = generateExportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cotizacion_${data.empresa.companyName.replace(/\s+/g, '_')}_${data.fecha.replace(/\//g, '-')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="quote-simulator-overlay">
      <div className="quote-simulator">
        <div className="quote-header">
          <h2 className="h2">Simulador de Cotización</h2>
          <button className="close-btn" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        {step === 'form' && (
          <form onSubmit={handleFormSubmit} className="quote-form">
            <div className="form-section">
              <h3 className="p1-medium">Datos de la Empresa</h3>
              
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label l1">Nombre de la empresa *</label>
                  <input
                    type="text"
                    required
                    value={companyData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="form-input p1"
                    placeholder="Ej: Empresa S.A."
                  />
                </div>
                <div className="form-field">
                  <label className="form-label l1">RUT *</label>
                  <input
                    type="text"
                    required
                    value={companyData.rut}
                    onChange={(e) => handleInputChange('rut', e.target.value)}
                    className="form-input p1"
                    placeholder="12.345.678-9"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label className="form-label l1">Nombre del contacto *</label>
                  <input
                    type="text"
                    required
                    value={companyData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    className="form-input p1"
                    placeholder="Juan Pérez"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label l1">Email *</label>
                  <input
                    type="email"
                    required
                    value={companyData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="form-input p1"
                    placeholder="contacto@empresa.cl"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label className="form-label l1">Teléfono</label>
                  <input
                    type="tel"
                    value={companyData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="form-input p1"
                    placeholder="+56 9 1234 5678"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label l1">Cantidad *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="form-input p1"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label l1">Dirección</label>
                <input
                  type="text"
                  value={companyData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="form-input p1"
                  placeholder="Av. Providencia 123"
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label className="form-label l1">Ciudad</label>
                  <input
                    type="text"
                    value={companyData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="form-input p1"
                    placeholder="Santiago"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label l1">Región</label>
                  <select
                    value={companyData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    className="form-input p1"
                  >
                    <option value="">Seleccionar región</option>
                    <option value="Metropolitana">Región Metropolitana</option>
                    <option value="Valparaíso">Región de Valparaíso</option>
                    <option value="Biobío">Región del Biobío</option>
                    <option value="Araucanía">Región de la Araucanía</option>
                    <option value="Los Lagos">Región de Los Lagos</option>
                    <option value="Antofagasta">Región de Antofagasta</option>
                    <option value="Coquimbo">Región de Coquimbo</option>
                    <option value="O'Higgins">Región del Libertador General Bernardo O'Higgins</option>
                    <option value="Maule">Región del Maule</option>
                    <option value="Ñuble">Región de Ñuble</option>
                    <option value="Los Ríos">Región de Los Ríos</option>
                    <option value="Atacama">Región de Atacama</option>
                    <option value="Tarapacá">Región de Tarapacá</option>
                    <option value="Arica y Parinacota">Región de Arica y Parinacota</option>
                    <option value="Aysén">Región Aysén del General Carlos Ibáñez del Campo</option>
                    <option value="Magallanes">Región de Magallanes y de la Antártica Chilena</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary cta1" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary cta1">
                <span className="material-icons">calculate</span>
                Calcular Cotización
              </button>
            </div>
          </form>
        )}

        {step === 'calculation' && (
          <div className="quote-calculation">
            <div className="product-summary">
              <h3 className="p1-medium">Producto: {product.name}</h3>
              <p className="l1">SKU: {product.sku} • Categoría: {product.category}</p>
            </div>

            <div className="quantity-adjuster">
              <label className="form-label l1">Ajustar cantidad:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                >
                  <span className="material-icons">remove</span>
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="quantity-input p1"
                  min="1"
                  max={product.stock}
                />
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="quantity-btn"
                >
                  <span className="material-icons">add</span>
                </button>
              </div>
            </div>

            <div className="quote-breakdown">
              <h4 className="p1-medium">Desglose de Precios</h4>
              
              <div className="breakdown-item">
                <span className="breakdown-label p1">Cantidad:</span>
                <span className="breakdown-value p1">{quote.quantity} unidades</span>
              </div>
              
              <div className="breakdown-item">
                <span className="breakdown-label p1">Precio unitario:</span>
                <span className="breakdown-value p1">{formatPrice(quote.unitPrice)}</span>
              </div>
              
              <div className="breakdown-item">
                <span className="breakdown-label p1">Subtotal:</span>
                <span className="breakdown-value p1">{formatPrice(quote.subtotal)}</span>
              </div>

              {quote.volumeDiscount > 0 && (
                <div className="breakdown-item discount">
                  <span className="breakdown-label p1">Descuento por volumen:</span>
                  <span className="breakdown-value p1">-{quote.volumeDiscount.toFixed(1)}%</span>
                </div>
              )}

              {quote.companyDiscount > 0 && (
                <div className="breakdown-item discount">
                  <span className="breakdown-label p1">Descuento empresarial:</span>
                  <span className="breakdown-value p1">-{quote.companyDiscount}%</span>
                </div>
              )}

              <div className="breakdown-item">
                <span className="breakdown-label p1">Envío:</span>
                <span className="breakdown-value p1">
                  {quote.shipping === 0 ? 'GRATIS' : formatPrice(quote.shipping)}
                </span>
              </div>

              <div className="breakdown-item">
                <span className="breakdown-label p1">IVA (19%):</span>
                <span className="breakdown-value p1">{formatPrice(quote.taxes)}</span>
              </div>

              <div className="breakdown-item total">
                <span className="breakdown-label p1-medium">TOTAL:</span>
                <span className="breakdown-value h2">{formatPrice(quote.total)}</span>
              </div>
            </div>

            <div className="discount-info">
              <h4 className="p1-medium">Información de Descuentos</h4>
              <ul className="discount-list">
                <li className="l1">• 5% descuento empresarial desde 100 unidades</li>
                <li className="l1">• 10% descuento empresarial desde 500 unidades</li>
                <li className="l1">• 15% descuento empresarial desde 1000 unidades</li>
                <li className="l1">• Envío gratis en compras sobre $50.000</li>
              </ul>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary cta1" 
                onClick={() => setStep('form')}
              >
                <span className="material-icons">arrow_back</span>
                Volver
              </button>
              <button 
                type="button" 
                className="btn btn-primary cta1"
                onClick={() => setStep('summary')}
              >
                <span className="material-icons">description</span>
                Generar Resumen
              </button>
            </div>
          </div>
        )}

        {step === 'summary' && (
          <div className="quote-summary">
            <div className="summary-header">
              <h3 className="p1-medium">Resumen de Cotización</h3>
              <p className="l1">Válida por 30 días desde la fecha de emisión</p>
            </div>

            <div className="summary-sections">
              <div className="summary-section">
                <h4 className="p1-medium">Empresa</h4>
                <div className="summary-content">
                  <p className="p1">{companyData.companyName}</p>
                  <p className="l1">RUT: {companyData.rut}</p>
                  <p className="l1">Contacto: {companyData.contactName}</p>
                  <p className="l1">Email: {companyData.email}</p>
                  {companyData.phone && <p className="l1">Teléfono: {companyData.phone}</p>}
                </div>
              </div>

              <div className="summary-section">
                <h4 className="p1-medium">Producto</h4>
                <div className="summary-content">
                  <p className="p1">{product.name}</p>
                  <p className="l1">SKU: {product.sku}</p>
                  <p className="l1">Categoría: {product.category}</p>
                  <p className="l1">Cantidad: {quote.quantity} unidades</p>
                </div>
              </div>

              <div className="summary-section">
                <h4 className="p1-medium">Total de la Cotización</h4>
                <div className="summary-content">
                  <div className="total-display">
                    <span className="h1">{formatPrice(quote.total)}</span>
                    <span className="l1">(IVA incluido)</span>
                  </div>
                </div>
              </div>

              <div className="summary-section">
                <h4 className="p1-medium">Condiciones</h4>
                <div className="summary-content">
                  <ul className="conditions-list">
                    <li className="l1">• Tiempo de producción: 7-10 días hábiles</li>
                    <li className="l1">• Garantía: 30 días</li>
                    <li className="l1">• Forma de pago: Transferencia bancaria o cheque</li>
                    <li className="l1">• Validez de la cotización: 30 días</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="export-actions">
              <h4 className="p1-medium">Exportar Cotización</h4>
              <div className="export-buttons">
                <button 
                  className="btn btn-secondary cta1"
                  onClick={exportToPDF}
                >
                  <span className="material-icons">picture_as_pdf</span>
                  Descargar TXT
                </button>
                <button 
                  className="btn btn-secondary cta1"
                  onClick={exportToJSON}
                >
                  <span className="material-icons">code</span>
                  Descargar JSON
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary cta1" 
                onClick={() => setStep('calculation')}
              >
                <span className="material-icons">arrow_back</span>
                Volver
              </button>
              <button 
                type="button" 
                className="btn btn-primary cta1"
                onClick={() => {
                  alert('Cotización enviada por email exitosamente')
                  onClose()
                }}
              >
                <span className="material-icons">email</span>
                Enviar por Email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuoteSimulator
