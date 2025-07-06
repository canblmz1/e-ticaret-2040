import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import useAuthStore from '../../store/authStore'
import useUIStore from '../../store/uiStore'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register, isAuthenticated, isLoading, error, clearError } = useAuthStore()
  const { showSuccess, showError } = useUIStore()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])
  
  useEffect(() => {
    clearError()
  }, [clearError])
  
  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    
    if (!agreeToTerms) {
      errors.terms = 'You must agree to the terms and conditions'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      })
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        password: formData.password
      }
      
      await register(userData)
      showSuccess('Account created successfully! Welcome to E-Commerce 2040!')
      navigate('/')
    } catch (err) {
      showError(err.message || 'Registration failed')
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2 mb-8">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-gradient-to-br from-cyber-blue to-neon-purple rounded-lg flex items-center justify-center"
              >
                <span className="text-white font-bold text-xl">E</span>
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyber-blue to-neon-purple bg-clip-text text-transparent">
                E-Commerce 2040
              </span>
            </Link>
            
            <h2 className="text-3xl font-bold text-white">
              Join the Future
            </h2>
            <p className="mt-2 text-gray-400">
              Create your account and step into tomorrow
            </p>
          </div>
          
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              <Input
                name="name"
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                leftIcon={<UserIcon className="w-5 h-5" />}
                error={formErrors.name}
                required
              />
              
              <Input
                name="email"
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                leftIcon={<EnvelopeIcon className="w-5 h-5" />}
                error={formErrors.email}
                required
              />
              
              <Input
                name="phone"
                type="tel"
                label="Phone Number (Optional)"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                leftIcon={<PhoneIcon className="w-5 h-5" />}
              />
              
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                leftIcon={<LockClosedIcon className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                }
                error={formErrors.password}
                helperText="Must be at least 6 characters"
                required
              />
              
              <Input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                leftIcon={<LockClosedIcon className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                }
                error={formErrors.confirmPassword}
                required
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => {
                    setAgreeToTerms(e.target.checked)
                    if (formErrors.terms) {
                      setFormErrors({ ...formErrors, terms: '' })
                    }
                  }}
                  className="h-4 w-4 text-cyber-blue focus:ring-cyber-blue border-gray-600 rounded bg-gray-800 mt-1"
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-300">
                  I agree to the{' '}
                  <Link to="/terms" className="text-cyber-blue hover:text-cyber-blue/80 transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-cyber-blue hover:text-cyber-blue/80 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              
              {formErrors.terms && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm"
                >
                  {formErrors.terms}
                </motion.p>
              )}
            </div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 rounded-lg p-3"
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}
            
            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </motion.form>
          
          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-cyber-blue hover:text-cyber-blue/80 transition-colors font-medium"
              >
                Sign in here
              </Link>
            </p>
          </motion.div>
        </motion.div>
        
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-neon-purple/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
