import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowRightIcon, 
  SparklesIcon, 
  CubeIcon, 
  ShieldCheckIcon,
  TruckIcon,
  GlobeAltIcon,
  EyeIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

import Button from '../components/ui/Button'
import ProductCard from '../components/product/ProductCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newProducts, setNewProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    fetchHomeData()
  }, [])
  
  const fetchHomeData = async () => {
    try {
      setLoading(true)
      
      // Fetch featured products
      const featuredResponse = await fetch('/api/products?featured=true&limit=6')
      const featuredData = await featuredResponse.json()
      
      // Fetch new products
      const newResponse = await fetch('/api/products?sort=-createdAt&limit=8')
      const newData = await newResponse.json()
      
      if (featuredResponse.ok) {
        setFeaturedProducts(featuredData.products || [])
      }
      
      if (newResponse.ok) {
        setNewProducts(newData.products || [])
      }
      
    } catch (err) {
      setError('Failed to load products')
      console.error('Error fetching home data:', err)
      
      // Demo data for development
      setFeaturedProducts([
        {
          _id: '1',
          name: 'Neural Interface Headset VR-X1',
          description: 'Experience the future with our revolutionary neural interface technology.',
          price: 999.99,
          originalPrice: 1299.99,
          images: ['/api/placeholder/400/400'],
          category: 'VR Technology',
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
          category: 'Smart Home',
          rating: 4.6,
          reviewCount: 156,
          stock: 8,
          features: { smartHome: true, ar: true }
        }
      ])
      
      setNewProducts([
        {
          _id: '3',
          name: 'Holographic Display Monitor 4K',
          description: 'Revolutionary holographic display technology for the future workplace.',
          price: 1599.99,
          images: ['/api/placeholder/400/400'],
          category: 'Displays',
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
          category: 'Audio',
          rating: 4.7,
          reviewCount: 312,
          stock: 25,
          features: { aiRecommended: true }
        }
      ])
    } finally {
      setLoading(false)
    }
  }
  
  const features = [
    {
      icon: CubeIcon,
      title: 'AR Product Views',
      description: 'See products in your space before you buy with our advanced AR technology.'
    },
    {
      icon: SparklesIcon,
      title: 'AI Recommendations',
      description: 'Get personalized product suggestions powered by advanced machine learning.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Quantum Security',
      description: 'Your data is protected with quantum-encrypted security protocols.'
    },
    {
      icon: TruckIcon,
      title: 'Drone Delivery',
      description: 'Ultra-fast delivery using our autonomous drone fleet network.'
    }
  ]
  
  const stats = [
    { number: '2M+', label: 'Happy Customers' },
    { number: '50K+', label: 'Products' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'AI Support' }
  ]
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/50 to-violet-900/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyber-blue rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-white via-cyber-blue to-neon-purple bg-clip-text text-transparent">
                Welcome to
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyber-blue to-neon-purple bg-clip-text text-transparent">
                E-Commerce 2040
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Experience the future of shopping with AI-powered recommendations, 
              AR product visualization, and quantum-secure transactions.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/products">
                <Button 
                  size="xl" 
                  rightIcon={<ArrowRightIcon className="w-5 h-5" />}
                  className="w-full sm:w-auto"
                >
                  Explore Products
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="xl"
                leftIcon={<EyeIcon className="w-5 h-5" />}
                className="w-full sm:w-auto"
              >
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-cyber-blue rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-cyber-blue rounded-full mt-2"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Future-Ready Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover cutting-edge technology that transforms your shopping experience
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-cyber-blue/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-cyber-blue to-neon-purple rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Handpicked products that define the future of technology
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} featured={index === 0} />
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/products">
              <Button 
                variant="outline" 
                size="lg"
                rightIcon={<ArrowRightIcon className="w-5 h-5" />}
              >
                View All Products
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900/80 to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <motion.div
                  className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyber-blue to-neon-purple bg-clip-text text-transparent mb-2"
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* New Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Latest Arrivals
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Be the first to experience tomorrow's technology today
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyber-blue/10 to-neon-purple/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready for the Future?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join millions of customers experiencing the next generation of e-commerce
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button 
                  size="xl"
                  rightIcon={<HeartIcon className="w-5 h-5" />}
                  className="w-full sm:w-auto"
                >
                  Join Now
                </Button>
              </Link>
              <Link to="/about">
                <Button 
                  variant="outline" 
                  size="xl"
                  className="w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
