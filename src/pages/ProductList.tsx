import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import ProductFilters from '../components/ProductFilters'
import { products as allProducts } from '../data/products'
import { Product } from '../types/Product'
import './ProductList.css'

const ProductList = () => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts)
  const [supplierFilter, setSupplierFilter] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [priceRange, setPriceRange] = useState<{ min: number | null; max: number | null }>({
    min: null,
    max: null
  })

  // Filter and sort products based on criteria
  const filterProducts = (
    category: string, 
    search: string, 
    sort: string, 
    supplier: string,
    priceRange: { min: number | null; max: number | null }
  ) => {
    let filtered = [...allProducts]

    // Category filter
    if (category !== 'all') {
      filtered = filtered.filter(product => product.category === category)
    }

    // Search filter (case-insensitive)
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower)
      )
    }

    // Suppliers filter
    if (supplier !== 'all') {
      filtered = filtered.filter(product => product.supplier === supplier)
    }

    // Price range filter
    if (priceRange.min !== null) {
      filtered = filtered.filter(product => product.basePrice >= priceRange.min!)
    }
    if (priceRange.max !== null) {
      filtered = filtered.filter(product => product.basePrice <= priceRange.max!)
    }

    // Sorting logic
    switch (sort) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'price-asc':
        filtered.sort((a, b) => a.basePrice - b.basePrice)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.basePrice - a.basePrice)
        break
      case 'stock':
        filtered.sort((a, b) => b.stock - a.stock)
        break
      default:
        break
    }

    setFilteredProducts(filtered)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    filterProducts(category, searchQuery, sortBy, supplierFilter, priceRange)
  }

  const handleSearchChange = (search: string) => {
    setSearchQuery(search)
    filterProducts(selectedCategory, search, sortBy, supplierFilter, priceRange)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    filterProducts(selectedCategory, searchQuery, sort, supplierFilter, priceRange)
  }

  const handleSupplierChange = (supplier: string) => {
    setSupplierFilter(supplier)
    filterProducts(selectedCategory, searchQuery, sortBy, supplier, priceRange)
  }

  const handlePriceRangeChange = (min: number | null, max: number | null) => {
    const newPriceRange = { min, max }
    setPriceRange(newPriceRange)
    filterProducts(selectedCategory, searchQuery, sortBy, supplierFilter, newPriceRange)
  }

  const reset = () => {
    setSelectedCategory('all')
    setSearchQuery('')
    setSortBy('name')
    setSupplierFilter('all')
    setPriceRange({ min: null, max: null })
    filterProducts('all', '', 'name', 'all', { min: null, max: null })
  }

  const handleReset = () => {
    reset()
  }

  return (
    <div className="product-list-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-info">
            <h1 className="page-title h2">Catálogo de Productos</h1>
            <p className="page-subtitle p1">
              Descubre nuestra selección de productos promocionales premium
            </p>
          </div>
          
          <div className="page-stats">
            <div className="stat-item">
              <span className="stat-value p1-medium">{filteredProducts.length}</span>
              <span className="stat-label l1">productos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value p1-medium">6</span>
              <span className="stat-label l1">categorías</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <ProductFilters
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onCategoryChange={handleCategoryChange}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          onSupplierChange={handleSupplierChange}
          onPriceRangeChange={handlePriceRangeChange}
          onReset={handleReset}
        />

        {/* Products Grid */}
        <div className="products-section">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons">search_off</span>
              <h3 className="h2">No hay productos</h3>
              <p className="p1">No se encontraron productos que coincidan con tu búsqueda.</p>
              <button 
                className="btn btn-primary cta1"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setSupplierFilter('all')
                  setPriceRange({ min: null, max: null })
                  filterProducts('all', '', sortBy, 'all', { min: null, max: null })
                }}
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductList