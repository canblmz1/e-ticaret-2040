import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsAPI } from '../services/api'

// Get products with pagination and filters
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsAPI.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => data.data,
  })
}

// Get single product
export const useProduct = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getProduct(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    select: (data) => data.data,
  })
}

// Search products
export const useProductSearch = (query) => {
  return useQuery({
    queryKey: ['productSearch', query],
    queryFn: () => productsAPI.searchProducts(query),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => data.data,
  })
}

// Get product categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productsAPI.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    select: (data) => data.data,
  })
}

// Create product (admin)
export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (productData) => productsAPI.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// Update product (admin)
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, ...productData }) => productsAPI.updateProduct(id, productData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] })
    },
  })
}

// Delete product (admin)
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => productsAPI.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
