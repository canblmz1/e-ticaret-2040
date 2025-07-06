import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { StarIcon, EyeIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import Button from '../ui/Button'
import useCartStore from '../../store/cartStore'
import useUIStore from '../../store/uiStore'

const ProductCard = ({ product, className = '', featured = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addItem } = useCartStore()
  const { showSuccess } = useUIStore()
  
  const images = product.images || ['/api/placeholder/300/300']
  const price = product.variants?.[0]?.price || product.price || 0
  const originalPrice = product.originalPrice || price * 1.2
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100)
  
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [images.length])
  
  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, product.variants?.[0], 1)
    showSuccess(`${product.name} added to cart!`)
  }
  
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating)
      return filled ? (
        <StarSolid key={i} className="w-4 h-4 text-yellow-400" />
      ) : (
        <StarIcon key={i} className="w-4 h-4 text-gray-400" />
      )
    })
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`group bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-cyber-blue/50 transition-all duration-300 overflow-hidden ${featured ? 'lg:col-span-2' : ''} ${className}`}
    >
      <Link to={`/products/${product._id}`}>
        <div className="relative overflow-hidden aspect-square">
          {/* Discount Badge */}
          {discount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-lg text-xs font-bold"
            >
              -{discount}%
            </motion.div>
          )}
          
          {/* AI Badge */}
          {product.features?.aiRecommended && (
            <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
              AI Pick
            </div>
          )}
          
          {/* Product Image */}
          <div className="relative w-full h-full bg-gray-900/50">
            <motion.img
              src={images[currentImageIndex]}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              whileHover={{ scale: 1.05 }}
            />
            
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-cyber-blue border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
            
            {/* Quick Actions */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // Quick view functionality
                  }}
                >
                  <EyeIcon className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-cyber-blue/80 backdrop-blur-sm rounded-full text-white hover:bg-cyber-blue transition-colors"
                  onClick={handleAddToCart}
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          {/* Category */}
          <span className="text-xs text-cyber-blue font-medium uppercase tracking-wider">
            {product.category}
          </span>
          
          {/* Title */}
          <h3 className="text-white font-semibold group-hover:text-cyber-blue transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          {/* Description */}
          <p className="text-gray-400 text-sm line-clamp-2">
            {product.description}
          </p>
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {renderStars(product.rating)}
              </div>
              <span className="text-gray-400 text-sm">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">
                ${price.toFixed(2)}
              </span>
              {discount > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Stock Status */}
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className={`text-xs ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
          
          {/* Features */}
          {product.features && (
            <div className="flex flex-wrap gap-1">
              {product.features.vr && (
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                  VR Ready
                </span>
              )}
              {product.features.ar && (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                  AR View
                </span>
              )}
              {product.features.smartHome && (
                <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                  Smart Home
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard
