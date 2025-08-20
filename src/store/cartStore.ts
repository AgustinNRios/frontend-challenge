import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from '../types/Product'

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (product: Product, quantity: number, selectedColor?: string, selectedSize?: string) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (productId: number) => number
}

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
  return { totalItems, totalPrice }
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (product: Product, quantity: number, selectedColor?: string, selectedSize?: string) => {
        const state = get()
        const existingItemIndex = state.items.findIndex(
          item => item.id === product.id && 
                  item.selectedColor === selectedColor && 
                  item.selectedSize === selectedSize
        )

        let newItems: CartItem[]
        
        if (existingItemIndex >= 0) {
          // Update existing item quantity
          newItems = state.items.map((item, index) => 
            index === existingItemIndex 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        } else {
          // Add new item to cart
          const newItem: CartItem = {
            ...product,
            quantity,
            selectedColor,
            selectedSize,
            unitPrice: product.basePrice // Use base price for now, could be improved with price breaks
          }
          newItems = [...state.items, newItem]
        }

        const { totalItems, totalPrice } = calculateTotals(newItems)
        
        set({
          items: newItems,
          totalItems,
          totalPrice
        })
      },

      removeItem: (productId: number) => {
        const state = get()
        const newItems = state.items.filter(item => item.id !== productId)
        const { totalItems, totalPrice } = calculateTotals(newItems)
        
        set({
          items: newItems,
          totalItems,
          totalPrice
        })
      },

      updateQuantity: (productId: number, quantity: number) => {
        const state = get()
        
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          get().removeItem(productId)
          return
        }

        const newItems = state.items.map(item => 
          item.id === productId ? { ...item, quantity } : item
        )
        
        const { totalItems, totalPrice } = calculateTotals(newItems)
        
        set({
          items: newItems,
          totalItems,
          totalPrice
        })
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0
        })
      },

      getItemQuantity: (productId: number) => {
        const state = get()
        const item = state.items.find(item => item.id === productId)
        return item ? item.quantity : 0
      }
    }),
    {
      name: 'cart-storage', // localStorage key
      partialize: (state) => ({ 
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice
      }),
    }
  )
)
