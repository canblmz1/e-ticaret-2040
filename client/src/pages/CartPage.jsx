import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrashIcon, 
  PlusIcon, 
  MinusIcon, 
  ShoppingBagIcon,
  ArrowRightIcon,
  HeartIcon,
  TruckIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import useCartStore from '../store/cartStore'
import useAuthStore from '../store/authStore'
import useUIStore from '../store/uiStore'

const CartPage = () => {
  const navigate = useNavigate()
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const { showSuccess, showWarning } = useUIStore()
  
  const [loading, setLoading] = useState(false)
  
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId)
      return
    }
    updateQuantity(itemId, newQuantity)
  }
  
  const handleRemoveItem = (itemId) => {
    removeItem(itemId)
    showSuccess('Item removed from cart')
  }
  
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart()
      showSuccess('Cart cleared')
    }
  }
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      showWarning('Please log in to proceed with checkout')
      navigate('/login', { state: { from: { pathname: '/checkout' } } })
      return
    }
    
    if (items.length === 0) {
      showWarning('Your cart is empty')
      return
    }
    
    navigate('/checkout')
  }
  
  const CartItem = ({ item }) => {
    const [quantity, setQuantity] = useState(item.quantity)
    const [isUpdating, setIsUpdating] = useState(false)
    
    const price = item.variant?.price || item.product.price
    const itemTotal = price * quantity
    
    const handleQuantityUpdate = async (newQuantity) => {
      setIsUpdating(true)
      setQuantity(newQuantity)
      
      // Simulate API delay
      setTimeout(() => {
        handleQuantityChange(item.id, newQuantity)
        setIsUpdating(false)
      }, 300)
    }
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
      >
        <div className="flex items-start gap-4">
          {/* Product Image */}
          <Link to={`/products/${item.product._id}`}>
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
              <img
                src={item.product.images?.[0] || '/api/placeholder/80/80'}
                alt={item.product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          </Link>
          
          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <Link 
              to={`/products/${item.product._id}`}
              className="block group"
            >
              <h3 className="text-white font-medium group-hover:text-cyber-blue transition-colors line-clamp-2">
                {item.product.name}
              </h3>
            </Link>
            
            <p className="text-gray-400 text-sm mt-1 line-clamp-1">
              {item.product.category}
            </p>
            
            {item.variant && (
              <p className="text-cyber-blue text-sm mt-1">
                {item.variant.name}
              </p>
            )}
            
            <div className="flex items-center gap-4 mt-3">
              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityUpdate(quantity - 1)}
                  disabled={isUpdating || quantity <= 1}
                  className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                
                <span className="w-8 text-center text-white font-medium">
                  {isUpdating ? (
                    <div className="w-4 h-4 border-2 border-cyber-blue border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    quantity
                  )}
                </span>
                
                <button
                  onClick={() => handleQuantityUpdate(quantity + 1)}
                  disabled={isUpdating}
                  className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    // Move to wishlist functionality
                    showSuccess('Item moved to wishlist')
                  }}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Move to Wishlist"
                >
                  <HeartIcon className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Remove Item"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Price */}
          <div className="text-right flex-shrink-0">
            <div className="text-white font-bold text-lg">
              ${itemTotal.toFixed(2)}
            </div>
            <div className="text-gray-400 text-sm">
              ${price.toFixed(2)} each
            </div>
          </div>
        </div>
      </motion.div>
    )
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Shopping Cart</h1>
          <p className="text-gray-400">
            {totalItems() > 0 ? `${totalItems()} item${totalItems() > 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
          </p>
        </motion.div>
        
        {items.length === 0 ? (
          /* Empty Cart */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. 
              Start shopping to fill it up with amazing future tech!
            </p>
            <Link to="/products">
              <Button 
                size="lg"
                rightIcon={<ShoppingBagIcon className="w-5 h-5" />}
              >
                Start Shopping
              </Button>
            </Link>
          </motion.div>
        ) : (
          /* Cart Content */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Items ({totalItems()})</h2>
                <button
                  onClick={handleClearCart}
                  className="text-red-400 hover:text-red-300 text-sm transition-colors"
                >
                  Clear Cart
                </button>
              </div>
              
              <AnimatePresence>
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </AnimatePresence>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 sticky top-24"
              >
                <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal ({totalItems()} items)</span>
                    <span>${totalPrice().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-400">
                    <span>Tax</span>
                    <span>${(totalPrice() * 0.1).toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total</span>
                      <span>${(totalPrice() * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={handleCheckout}
                  className="w-full mb-4"
                  size="lg"
                  rightIcon={<ArrowRightIcon className="w-5 h-5" />}
                >
                  Proceed to Checkout
                </Button>
                
                <Link to="/products">
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    Continue Shopping
                  </Button>
                </Link>
                
                {/* Benefits */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <TruckIcon className="w-4 h-4 text-green-400" />
                    <span>Free quantum delivery</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <ShieldCheckIcon className="w-4 h-4 text-blue-400" />
                    <span>30-day neural backup guarantee</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
