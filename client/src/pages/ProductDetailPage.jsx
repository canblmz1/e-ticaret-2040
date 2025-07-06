import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  StarIcon, 
  HeartIcon, 
  ShareIcon, 
  ShoppingCartIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'

import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import useCartStore from '../store/cartStore'
import useUIStore from '../store/uiStore'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  
  const { addItem } = useCartStore()
  const { showSuccess, showError } = useUIStore()
  
  useEffect(() => {
    fetchProduct()
  }, [id])
  
  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/products/${id}`)
      const data = await response.json()
      
      if (response.ok) {
        setProduct(data.product)
        if (data.product.variants?.length > 0) {
          setSelectedVariant(data.product.variants[0])
        }
      } else {
        throw new Error(data.message || 'Product not found')
      }
    } catch (err) {
      setError(err.message)
      console.error('Error fetching product:', err)
      
      // Demo data for development
      setProduct({
        _id: id,
        name: 'Neural Interface Headset VR-X1',
        description: 'Experience the future with our revolutionary neural interface technology that seamlessly connects your thoughts to digital environments. This cutting-edge device features quantum processing, haptic feedback, and AI-powered neural mapping for an unprecedented virtual reality experience.',
        longDescription: 'The Neural Interface Headset VR-X1 represents the pinnacle of virtual reality technology. Built with advanced neural mapping algorithms and quantum processors, this headset can interpret brain signals with 99.7% accuracy. The device features a lightweight carbon fiber frame, adaptive neural sensors, and immersive 8K displays for each eye.\n\nKey Features:\n• Direct neural interface connection\n• 8K per-eye resolution with 240Hz refresh rate\n• Quantum processing unit for real-time computation\n• Haptic feedback system with 1000+ pressure points\n• AI-powered personalization engine\n• Wireless connectivity with 0.1ms latency\n• 12-hour battery life with quick charging\n\nCompatible with all major VR platforms and includes access to our exclusive neural interface software suite.',
        price: 999.99,
        originalPrice: 1299.99,
        images: [
          '/api/placeholder/600/600',
          '/api/placeholder/600/600',
          '/api/placeholder/600/600',
          '/api/placeholder/600/600'
        ],
        category: 'VR Technology',
        rating: 4.8,
        reviewCount: 234,
        stock: 15,
        features: { vr: true, aiRecommended: true, smartHome: false, ar: true },
        variants: [
          { _id: 'v1', name: 'Standard Edition', price: 999.99, sku: 'VR-X1-STD', stock: 15 },
          { _id: 'v2', name: 'Pro Edition', price: 1499.99, sku: 'VR-X1-PRO', stock: 8 },
          { _id: 'v3', name: 'Enterprise Edition', price: 2999.99, sku: 'VR-X1-ENT', stock: 3 }
        ],
        specifications: {
          'Display': '8K per eye (7680 x 4320)',
          'Refresh Rate': '240Hz',
          'Field of View': '210°',
          'Weight': '485g',
          'Battery Life': '12 hours',
          'Connectivity': 'Wireless 6GHz, USB-C',
          'Sensors': 'Neural interface, 6DOF tracking',
          'Audio': '3D spatial audio with haptic feedback'
        }
      })
      
      if (product?.variants?.length > 0) {
        setSelectedVariant(product.variants[0])
      }
    } finally {
      setLoading(false)
    }
  }
  
  const handleAddToCart = () => {
    if (!product) return
    
    addItem(product, selectedVariant, quantity)
    showSuccess(`${product.name} added to cart!`)
  }
  
  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    showSuccess(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }
  
  const currentPrice = selectedVariant?.price || product?.price || 0
  const originalPrice = product?.originalPrice || currentPrice * 1.2
  const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
  
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating)
      return filled ? (
        <StarSolid key={i} className="w-5 h-5 text-yellow-400" />
      ) : (
        <StarIcon key={i} className="w-5 h-5 text-gray-400" />
      )
    })
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    )
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
          <p className="text-gray-400 mb-6">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
          <Button onClick={() => navigate('/products')} leftIcon={<ArrowLeftIcon className="w-5 h-5" />}>
            Back to Products
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-gray-400 mb-8"
        >
          <button onClick={() => navigate('/products')} className="hover:text-white transition-colors">
            Products
          </button>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </motion.nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square bg-gray-800/50 rounded-2xl overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-cyber-blue' : 'border-gray-700'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            
            {/* AR/VR Buttons */}
            {(product.features?.ar || product.features?.vr) && (
              <div className="flex gap-2">
                {product.features?.ar && (
                  <Button variant="outline" size="sm" leftIcon={<EyeIcon className="w-4 h-4" />}>
                    View in AR
                  </Button>
                )}
                {product.features?.vr && (
                  <Button variant="outline" size="sm" leftIcon={<CubeIcon className="w-4 h-4" />}>
                    Try in VR
                  </Button>
                )}
              </div>
            )}
          </motion.div>
          
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Title and Rating */}
            <div>
              <span className="text-cyber-blue font-medium text-sm uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-white mt-2 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                  <span className="text-white font-medium ml-2">{product.rating}</span>
                  <span className="text-gray-400">({product.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
            
            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-white">
                ${currentPrice.toFixed(2)}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                    -{discount}%
                  </span>
                </>
              )}
            </div>
            
            {/* Description */}
            <p className="text-gray-400 leading-relaxed">
              {product.description}
            </p>
            
            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="text-white font-medium mb-3">Choose Edition:</h3>
                <div className="space-y-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`w-full p-3 rounded-lg border transition-colors text-left ${
                        selectedVariant?._id === variant._id
                          ? 'border-cyber-blue bg-cyber-blue/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{variant.name}</span>
                        <span className="text-cyber-blue font-bold">${variant.price.toFixed(2)}</span>
                      </div>
                      <div className="text-gray-400 text-sm mt-1">
                        Stock: {variant.stock} units
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-gray-300">Qty:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyber-blue"
                >
                  {Array.from({ length: Math.min(10, selectedVariant?.stock || product.stock) }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              
              <Button
                onClick={handleAddToCart}
                leftIcon={<ShoppingCartIcon className="w-5 h-5" />}
                className="flex-1"
                disabled={!selectedVariant?.stock && !product.stock}
              >
                Add to Cart
              </Button>
              
              <button
                onClick={handleWishlist}
                className={`p-3 rounded-lg border transition-colors ${
                  isWishlisted 
                    ? 'border-red-500 text-red-500' 
                    : 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
                }`}
              >
                <HeartIcon className="w-6 h-6" />
              </button>
              
              <button className="p-3 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
                <ShareIcon className="w-6 h-6" />
              </button>
            </div>
            
            {/* Features */}
            <div className="flex flex-wrap gap-2">
              {product.features?.vr && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">
                  VR Ready
                </span>
              )}
              {product.features?.ar && (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">
                  AR View
                </span>
              )}
              {product.features?.smartHome && (
                <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full">
                  Smart Home
                </span>
              )}
              {product.features?.aiRecommended && (
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-sm rounded-full">
                  AI Recommended
                </span>
              )}
            </div>
            
            {/* Shipping Info */}
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <TruckIcon className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">Free Drone Delivery</p>
                  <p className="text-gray-400 text-sm">Delivered in 2-3 hours via quantum transport</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <ShieldCheckIcon className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Quantum Security Guarantee</p>
                  <p className="text-gray-400 text-sm">30-day return policy with neural backup</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Product Details</h3>
            
            {product.longDescription && (
              <div className="mb-6">
                <h4 className="text-white font-medium mb-2">Description</h4>
                <div className="text-gray-400 whitespace-pre-line">
                  {product.longDescription}
                </div>
              </div>
            )}
            
            {product.specifications && (
              <div>
                <h4 className="text-white font-medium mb-4">Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">{key}:</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProductDetailPage
