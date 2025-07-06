import { motion } from 'framer-motion'
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  ShoppingBagIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import useAuthStore from '../../store/authStore'

const AdminDashboard = () => {
  const { user } = useAuthStore()
  
  const stats = [
    {
      title: 'Total Users',
      value: '2,048',
      icon: UserGroupIcon,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20'
    },
    {
      title: 'Total Orders',
      value: '15,234',
      icon: ShoppingBagIcon,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20'
    },
    {
      title: 'Revenue',
      value: '$1.2M',
      icon: CurrencyDollarIcon,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20'
    },
    {
      title: 'Products',
      value: '50,128',
      icon: ChartBarIcon,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20'
    }
  ]
  
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
            <p className="text-gray-400">
              Welcome back, {user?.name}! Here's what's happening in your e-commerce empire.
            </p>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors text-white">
                  Add New Product
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors text-white">
                  View Pending Orders
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors text-white">
                  Manage Users
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="p-3 bg-gray-900/50 rounded-lg">
                  <p className="text-white text-sm">New order #2040-001</p>
                  <p className="text-gray-400 text-xs">2 minutes ago</p>
                </div>
                <div className="p-3 bg-gray-900/50 rounded-lg">
                  <p className="text-white text-sm">User registered: john@demo.com</p>
                  <p className="text-gray-400 text-xs">5 minutes ago</p>
                </div>
                <div className="p-3 bg-gray-900/50 rounded-lg">
                  <p className="text-white text-sm">Product updated: VR Headset</p>
                  <p className="text-gray-400 text-xs">10 minutes ago</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              🚧 Full admin dashboard with analytics and management tools coming soon!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard
