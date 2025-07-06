import { forwardRef } from 'react'
import { motion } from 'framer-motion'

const Input = forwardRef(({ 
  label, 
  error, 
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const baseClasses = 'w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:border-transparent transition-all duration-300'
  
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : ''
  
  const classes = `${baseClasses} ${errorClasses} ${leftIcon ? 'pl-12' : ''} ${rightIcon ? 'pr-12' : ''} ${className}`
  
  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <motion.input
          ref={ref}
          className={classes}
          whileFocus={{ scale: 1.01 }}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm"
        >
          {error}
        </motion.p>
      )}
      
      {helperText && !error && (
        <p className="text-gray-500 text-sm">
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export const TextArea = forwardRef(({ 
  label, 
  error, 
  helperText,
  className = '',
  containerClassName = '',
  rows = 4,
  ...props 
}, ref) => {
  const baseClasses = 'w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:border-transparent transition-all duration-300 resize-vertical'
  
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : ''
  
  const classes = `${baseClasses} ${errorClasses} ${className}`
  
  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      
      <motion.textarea
        ref={ref}
        className={classes}
        rows={rows}
        whileFocus={{ scale: 1.01 }}
        {...props}
      />
      
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm"
        >
          {error}
        </motion.p>
      )}
      
      {helperText && !error && (
        <p className="text-gray-500 text-sm">
          {helperText}
        </p>
      )}
    </div>
  )
})

TextArea.displayName = 'TextArea'

export default Input
