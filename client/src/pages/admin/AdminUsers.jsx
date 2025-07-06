import { motion } from 'framer-motion'
import { UserGroupIcon } from '@heroicons/react/24/outline'

const AdminUsers = () => {
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserGroupIcon className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">User Management</h1>
          <p className="text-gray-400 mb-8">
            Manage user accounts and permissions
          </p>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
            <p className="text-center text-gray-400">
              🚧 User management interface coming soon!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminUsers
