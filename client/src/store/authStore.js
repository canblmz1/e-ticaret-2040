import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setToken: (token) => set({ token }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
          const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(credentials)
          })
          
          if (!response.ok) {
            let errorMessage = 'Login failed'
            try {
              const errorData = await response.json()
              errorMessage = errorData.error || errorData.message || errorMessage
            } catch (e) {
              // If response is not JSON, use status text
              errorMessage = response.statusText || errorMessage
            }
            throw new Error(errorMessage)
          }
          
          const data = await response.json()
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
          
          return data
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message,
            isAuthenticated: false,
            user: null,
            token: null
          })
          throw error
        }
      },
      
      register: async (userData) => {
        set({ isLoading: true, error: null })
        try {
          const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
          const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(userData)
          })
          
          if (!response.ok) {
            let errorMessage = 'Registration failed'
            try {
              const errorData = await response.json()
              errorMessage = errorData.error || errorData.message || errorMessage
            } catch (e) {
              // If response is not JSON, use status text
              errorMessage = response.statusText || errorMessage
            }
            throw new Error(errorMessage)
          }
          
          const data = await response.json()
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
          
          return data
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message,
            isAuthenticated: false,
            user: null,
            token: null
          })
          throw error
        }
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        })
      },
      
      updateProfile: async (userData) => {
        const { token } = get()
        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
          })
          
          const data = await response.json()
          
          if (!response.ok) {
            throw new Error(data.message || 'Update failed')
          }
          
          set({
            user: data.user,
            isLoading: false,
            error: null
          })
          
          return data
        } catch (error) {
          set({ isLoading: false, error: error.message })
          throw error
        }
      },
      
      clearError: () => set({ error: null }),
      
      // Admin check
      isAdmin: () => {
        const { user } = get()
        return user?.role === 'admin'
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

export default useAuthStore
