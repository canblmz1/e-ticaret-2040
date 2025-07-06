import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, Link } from 'react-router-dom'
import { 
  FunnelIcon, 
  MagnifyingGlassIcon, 
  XMarkIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'

import ProductCard from '../components/product/ProductCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalProducts, setTotalProducts] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  
  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    features: searchParams.getAll('features') || [],
    sortBy: searchParams.get('sort') || '-createdAt'
  })
  
  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 
    'Beauty', 'Automotive', 'Toys', 'Health', 'Jewelry'
  ]
  
  const features = [
    { key: 'vr', label: 'VR Ready' },
    { key: 'ar', label: 'AR View' },
    { key: 'smartHome', label: 'Smart Home' },
    { key: 'aiRecommended', label: 'AI Recommended' },
    { key: 'ecoFriendly', label: 'Eco Friendly' }
  ]
  
  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: '-rating', label: 'Highest Rated' },
    { value: 'name', label: 'Name: A to Z' },
    { value: '-name', label: 'Name: Z to A' }
  ]
  
  useEffect(() => {
    fetchProducts()
  }, [searchParams, currentPage])
  
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const queryParams = new URLSearchParams(searchParams)
      queryParams.set('page', currentPage.toString())
      queryParams.set('limit', '12')
      
      const response = await fetch(`/api/products?${queryParams}`)
      const data = await response.json()
      
      if (response.ok) {
        setProducts(data.products || [])
        setTotalProducts(data.total || 0)
      } else {
        throw new Error(data.message || 'Failed to fetch products')
      }
    } catch (err) {
      setError(err.message)
      console.error('Error fetching products:', err)
      
      // Demo data for development
      setProducts([
        {
          _id: '1',
          name: 'Neural Interface Headset VR-X1',
          description: 'Experience the future with our revolutionary neural interface technology.',
          price: 999.99,
          originalPrice: 1299.99,
          images: ['/api/placeholder/400/400'],
          category: 'Electronics',
          rating: 4.8,
          reviewCount: 234,
          stock: 15,
          features: { vr: true, aiRecommended: true }
        },
        {
          _id: '2',
          name: 'Smart Home AI Assistant Pro',
          description: 'Control your entire smart home with advanced AI voice recognition.',
          price: 299.99,
          images: ['/api/placeholder/400/400'],
          category: 'Electronics',
          rating: 4.6,
          reviewCount: 156,
          stock: 8,
          features: { smartHome: true, ar: true }
        },
        {
          _id: '3',
          name: 'Holographic Display Monitor 4K',
          description: 'Revolutionary holographic display technology for the future workplace.',
          price: 1599.99,
          images: ['/api/placeholder/400/400'],
          category: 'Electronics',
          rating: 4.9,
          reviewCount: 89,
          stock: 5,
          features: { vr: true }
        },
        {
          _id: '4',
          name: 'Quantum Wireless Earbuds',
          description: 'Experience sound like never before with quantum audio technology.',
          price: 199.99,
          images: ['/api/placeholder/400/400'],
          category: 'Electronics',
          rating: 4.7,
          reviewCount: 312,
          stock: 25,
          features: { aiRecommended: true }
        }
      ])
      setTotalProducts(4)
    } finally {
      setLoading(false)
    }
  }
  
  const updateFilters = (newFilters) => {
    setFilters(newFilters)
    const params = new URLSearchParams()
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v))
        } else {
          params.set(key, value)
        }
      }
    })
    
    setSearchParams(params)
    setCurrentPage(1)
  }
  
  const clearFilters = () => {
    const newFilters = {
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      features: [],
      sortBy: '-createdAt'
    }
    updateFilters(newFilters)
  }
  
  const totalPages = Math.ceil(totalProducts / 12)
  
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400"
          >
            Discover {totalProducts} cutting-edge products for the future
          </motion.p>
        </div>
        
        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:w-80 ${filtersOpen ? 'block' : 'hidden lg:block'}`}
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-cyber-blue hover:text-cyber-blue/80 text-sm"
                >
                  Clear All
                </button>
              </div>
              
              {/* Search */}
              <div className="mb-6">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
                  leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
                />
              </div>
              
              {/* Category */}
              <div className="mb-6">
                <label className="block text-gray-300 font-medium mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilters({ ...filters, category: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyber-blue"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-gray-300 font-medium mb-2">Price Range</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => updateFilters({ ...filters, minPrice: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilters({ ...filters, maxPrice: e.target.value })}
                  />
                </div>
              </div>
              
              {/* Rating */}
              <div className="mb-6">
                <label className="block text-gray-300 font-medium mb-2">Minimum Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => updateFilters({ ...filters, rating: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyber-blue"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Star</option>
                </select>
              </div>
              
              {/* Features */}
              <div className="mb-6">
                <label className="block text-gray-300 font-medium mb-2">Features</label>
                <div className="space-y-2">
                  {features.map(feature => (
                    <label key={feature.key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.features.includes(feature.key)}
                        onChange={(e) => {
                          const newFeatures = e.target.checked
                            ? [...filters.features, feature.key]
                            : filters.features.filter(f => f !== feature.key)
                          updateFilters({ ...filters, features: newFeatures })
                        }}
                        className="w-4 h-4 text-cyber-blue border-gray-600 rounded focus:ring-cyber-blue focus:ring-2"
                      />
                      <span className="text-gray-300 text-sm">{feature.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  leftIcon={<FunnelIcon className="w-4 h-4" />}
                  className="lg:hidden"
                >
                  Filters
                </Button>
                
                <span className="text-gray-400 text-sm">
                  {totalProducts} products found
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* View Mode */}
                <div className="flex border border-gray-700 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-cyber-blue text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
                  >
                    <Squares2X2Icon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-cyber-blue text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
                  >
                    <ListBulletIcon className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Sort */}
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilters({ ...filters, sortBy: e.target.value })}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyber-blue"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Products */}
            {loading ? (
              <div className="flex justify-center py-20">
                <LoadingSpinner size="xl" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-400 mb-4">{error}</p>
                <Button onClick={fetchProducts}>Try Again</Button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-white text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <motion.div
                layout
                className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}
              >
                <AnimatePresence>
                  {products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    )
                  })}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
