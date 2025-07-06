import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bars3Icon, 
  XMarkIcon, 
  ShoppingCartIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  BellIcon,
  CogIcon,
  HomeIcon,
  CubeIcon,
  HeartIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { UserIcon as UserSolid } from '@heroicons/react/24/solid'

import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import useUIStore from '../../store/uiStore'
import Button from '../ui/Button'
import Input from '../ui/Input'

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  const { user, isAuthenticated, logout } = useAuthStore()
  const { totalItems, toggleCart } = useCartStore()
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu, searchQuery, setSearchQuery } = useUIStore()
  const navigate = useNavigate()
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu')) {
        setUserMenuOpen(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [userMenuOpen])
  
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      closeMobileMenu()
    }
  }
  
  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }
  
  const navigationItems = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Products', href: '/products', icon: CubeIcon },
    { name: 'About', href: '/about', icon: null },
    { name: 'Contact', href: '/contact', icon: null }
  ]
  
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-gray-900/95 backdrop-blur-lg border-b border-gray-700/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 bg-gradient-to-br from-cyber-blue to-neon-purple rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">E</span>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyber-blue to-neon-purple bg-clip-text text-transparent">
              E-Commerce 2040
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Search */}
          <div className="hidden lg:flex items-center">
            <AnimatePresence>
              {searchOpen ? (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 300, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleSearch}
                  className="relative"
                >
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </motion.form>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-gray-300 hover:text-white transition-colors"
                >
                  <MagnifyingGlassIcon className="w-6 h-6" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCart}
              className="relative p-2 text-gray-300 hover:text-white transition-colors"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {totalItems() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-cyber-blue text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  {totalItems()}
                </motion.span>
              )}
            </motion.button>
            
            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative user-menu">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white transition-colors"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <UserSolid className="w-6 h-6" />
                  )}
                  <ChevronDownIcon className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>
                
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-white font-medium">{user?.name}</p>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                      </div>
                      
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <UserIcon className="w-4 h-4" />
                        Profile
                      </Link>
                      
                      <Link
                        to="/orders"
                        className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <CubeIcon className="w-4 h-4" />
                        Orders
                      </Link>
                      
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <CogIcon className="w-4 h-4" />
                          Admin
                        </Link>
                      )}
                      
                      <hr className="border-gray-700 my-2" />
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 transition-colors"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-700/50"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch}>
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
                />
              </form>
              
              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    {item.name}
                  </Link>
                ))}
              </nav>
              
              {/* Mobile Auth */}
              {!isAuthenticated && (
                <div className="space-y-2 pt-4 border-t border-gray-700">
                  <Link to="/login" onClick={closeMobileMenu}>
                    <Button variant="ghost" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={closeMobileMenu}>
                    <Button variant="primary" className="w-full">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header
