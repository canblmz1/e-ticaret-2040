import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersAPI } from '../services/api'
import useAuthStore from '../store/authStore'

// Get user orders
export const useOrders = (params = {}) => {
  const { isAuthenticated } = useAuthStore()
  
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersAPI.getOrders(params),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => data.data,
  })
}

// Get single order
export const useOrder = (id) => {
  const { isAuthenticated } = useAuthStore()
  
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersAPI.getOrder(id),
    enabled: !!id && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => data.data,
  })
}

// Create order
export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (orderData) => ordersAPI.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

// Update order status (admin)
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status }) => ordersAPI.updateOrderStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] })
    },
  })
}

// Cancel order
export const useCancelOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => ordersAPI.cancelOrder(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', variables] })
    },
  })
}
