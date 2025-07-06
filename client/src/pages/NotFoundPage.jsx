import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import Button from '../components/ui/Button'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="text-8xl font-bold bg-gradient-to-r from-cyber-blue to-neon-purple bg-clip-text text-transparent mb-4">
            404
          </div>
          <div className="text-6xl mb-4">🤖</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-400 mb-8">
            Looks like this page took a trip to the future and hasn't come back yet. 
            Let's get you back to familiar territory.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-4"
        >
          <Link to="/">
            <Button 
              size="lg" 
              leftIcon={<HomeIcon className="w-5 h-5" />}
              className="w-full"
            >
              Go Home
            </Button>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="w-full text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Go Back
          </button>
        </motion.div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyber-blue/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
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

export default NotFoundPage
