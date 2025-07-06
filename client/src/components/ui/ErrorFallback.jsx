import { motion } from 'framer-motion'
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-purple-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800/90 backdrop-blur-lg border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          className="text-red-400 mb-6 flex justify-center"
        >
          <ExclamationTriangleIcon className="w-16 h-16" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-white mb-4">
          Oops! Something went wrong
        </h2>
        
        <p className="text-gray-300 mb-6">
          We're sorry, but something unexpected happened. Please try again.
        </p>
        
        {error && (
          <details className="mb-6 text-left">
            <summary className="text-red-400 cursor-pointer mb-2 font-medium">
              Error Details
            </summary>
            <pre className="text-sm text-gray-400 bg-gray-900/50 p-3 rounded-lg overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
        
        <button
          onClick={resetErrorBoundary}
          className="bg-gradient-to-r from-cyber-blue to-neon-purple hover:from-cyber-blue/80 hover:to-neon-purple/80 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Try Again
        </button>
      </motion.div>
    </div>
  )
}

export default ErrorFallback
