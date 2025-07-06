import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import NotificationContainer from './components/ui/NotificationContainer.jsx'
import './index.css'

// React Query client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <NotificationContainer />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'toast',
          success: {
            className: 'toast success',
          },
          error: {
            className: 'toast error',
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>,
)
