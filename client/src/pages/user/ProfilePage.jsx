import { motion } from 'framer-motion'
import { UserIcon, ShoppingBagIcon, CogIcon } from '@heroicons/react/24/outline'
import useAuthStore from '../../store/authStore'

const ProfilePage = () => {
  const { user } = useAuthStore()
  
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-cyber-blue to-neon-purple rounded-full flex items-center justify-center mx-auto mb-6">
            <UserIcon className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">User Profile</h1>
          <p className="text-gray-400 mb-8">
            Welcome back, {user?.name || 'Future User'}!
          </p>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Profile Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Name</label>
                <p className="text-white font-medium">{user?.name || 'Demo User'}</p>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">Email</label>
                <p className="text-white font-medium">{user?.email || 'user@demo.com'}</p>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">Role</label>
                <p className="text-white font-medium capitalize">{user?.role || 'user'}</p>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">Member Since</label>
                <p className="text-white font-medium">January 2040</p>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-700">
              <p className="text-center text-gray-400">
                🚧 Profile management features coming soon in the next update!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage
