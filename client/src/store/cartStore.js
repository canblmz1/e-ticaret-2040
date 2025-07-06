import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      isOpen: false,
      isLoading: false,
      
      // Computed values
      totalItems: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },
      
      totalPrice: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          const price = item.variant ? item.variant.price : item.product.price
          return total + (price * item.quantity)
        }, 0)
      },
      
      // Actions
      addItem: (product, variant = null, quantity = 1) => {
        const { items } = get()
        const itemId = `${product._id}-${variant?._id || 'default'}`
        
        const existingItem = items.find(item => {
          const existingItemId = `${item.product._id}-${item.variant?._id || 'default'}`
          return existingItemId === itemId
        })
        
        if (existingItem) {
          set({
            items: items.map(item => {
              const existingItemId = `${item.product._id}-${item.variant?._id || 'default'}`
              return existingItemId === itemId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            })
          })
        } else {
          set({
            items: [...items, {
              id: itemId,
              product,
              variant,
              quantity,
              addedAt: new Date().toISOString()
            }]
          })
        }
      },
      
      removeItem: (itemId) => {
        const { items } = get()
        set({
          items: items.filter(item => item.id !== itemId)
        })
      },
      
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        
        const { items } = get()
        set({
          items: items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )
        })
      },
      
      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      closeCart: () => set({ isOpen: false }),
      
      openCart: () => set({ isOpen: true }),
      
      // Sync cart with server (for authenticated users)
      syncCart: async (token) => {
        if (!token) return
        
        const { items } = get()
        set({ isLoading: true })
        
        try {
          const response = await fetch('/api/cart/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ items })
          })
          
          const data = await response.json()
          
          if (response.ok) {
            set({ items: data.items || [] })
          }
        } catch (error) {
          console.error('Cart sync failed:', error)
        } finally {
          set({ isLoading: false })
        }
      },
      
      // Load cart from server
      loadCart: async (token) => {
        if (!token) return
        
        set({ isLoading: true })
        
        try {
          const response = await fetch('/api/cart', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          const data = await response.json()
          
          if (response.ok) {
            set({ items: data.items || [] })
          }
        } catch (error) {
          console.error('Cart load failed:', error)
        } finally {
          set({ isLoading: false })
        }
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items
      })
    }
  )
)

export default useCartStore
