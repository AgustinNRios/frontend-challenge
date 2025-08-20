import { useState } from 'react'
import { categories, suppliers } from '../data/products'
import './ProductFilters.css'

interface ProductFiltersProps {
  selectedCategory: string
  searchQuery: string
  sortBy: string
  onCategoryChange: (category: string) => void
  onSearchChange: (search: string) => void
  onSortChange: (sort: string) => void
  onSupplierChange: (supplier: string) => void
  onPriceRangeChange: (min: number | null, max: number | null) => void
}

const ProductFilters = ({
  selectedCategory,
  searchQuery,
  sortBy,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onSupplierChange,
  onPriceRangeChange,
}: ProductFiltersProps) => {
  const [minPrice, setMinPrice] = useState<number | ''>('')
  const [maxPrice, setMaxPrice] = useState<number | ''>('')

  return (
    <div className="product-filters">
      <div className="filters-card">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-box">
            <span className="material-icons">search</span>
            <input
              type="text"
              placeholder="Buscar productos, SKU..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input p1"
            />
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => onSearchChange('')}
              >
                <span className="material-icons">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Categorías</h3>
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => onCategoryChange(category.id)}
              >
                <span className="material-icons">{category.icon}</span>
                <span className="category-name l1">{category.name}</span>
                <span className="category-count l1">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Ordenar por</h3>
          <select 
            value={sortBy} 
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select p1"
          >
            <option value="name">Nombre A-Z</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
            <option value="stock">Stock disponible</option>
          </select>
        </div>

        {/* Quick Stats - Bug: hardcoded values instead of dynamic */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Proveedores</h3>
          <div className="supplier-list">
            {suppliers.map(supplier => (
              <button key={supplier.id} className="supplier-item" onClick={() => onSupplierChange(supplier.id)}>
                <span className="supplier-name l1">{supplier.name}</span>
                <span className="supplier-count l1">{supplier.products}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3 className="filter-title p1-medium">Rango de precios</h3>
          <div className="price-range">
            <div className="price-input-group">
              <input 
                type="number" 
                className="price-input" 
                placeholder="Mínimo" 
                min="0"
                value={minPrice}
                onChange={(e) => {
                  const value = e.target.value ? Number(e.target.value) : ''
                  setMinPrice(value)
                  onPriceRangeChange(value === '' ? null : value, maxPrice === '' ? null : maxPrice)
                }}
              />
              <span className="price-separator">-</span>
              <input 
                type="number" 
                className="price-input" 
                placeholder="Máximo" 
                min="0"
                value={maxPrice}
                onChange={(e) => {
                  const value = e.target.value ? Number(e.target.value) : ''
                  setMaxPrice(value)
                  onPriceRangeChange(minPrice === '' ? null : minPrice, value === '' ? null : value)
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductFilters