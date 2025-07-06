import { create } from 'zustand'

const useUIStore = create((set, get) => ({
  // State
  theme: 'dark',
  sidebarOpen: false,
  mobileMenuOpen: false,
  searchQuery: '',
  notifications: [],
  isLoading: false,
  
  // Actions
  setTheme: (theme) => set({ theme }),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  closeSidebar: () => set({ sidebarOpen: false }),
  
  openSidebar: () => set({ sidebarOpen: true }),
  
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  
  openMobileMenu: () => set({ mobileMenuOpen: true }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  // Notifications
  addNotification: (notification) => {
    const id = Date.now().toString()
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification,
      createdAt: new Date().toISOString()
    }
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }))
    
    // Auto remove notification
    if (newNotification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(id)
      }, newNotification.duration)
    }
    
    return id
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }))
  },
  
  clearNotifications: () => set({ notifications: [] }),
  
  // Helper methods
  showSuccess: (message, options = {}) => {
    return get().addNotification({
      type: 'success',
      message,
      ...options
    })
  },
  
  showError: (message, options = {}) => {
    return get().addNotification({
      type: 'error',
      message,
      duration: 8000,
      ...options
    })
  },
  
  showWarning: (message, options = {}) => {
    return get().addNotification({
      type: 'warning',
      message,
      ...options
    })
  },
  
  showInfo: (message, options = {}) => {
    return get().addNotification({
      type: 'info',
      message,
      ...options
    })
  }
}))

export default useUIStore
