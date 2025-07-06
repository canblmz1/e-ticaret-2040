import { motion } from 'framer-motion'
import { ShoppingBagIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const OrdersPage = () => {
  const demoOrders = [
    {
      id: 'ORD-2040-001',
      date: '2025-01-05',
      status: 'delivered',
      total: 999.99,
      items: 2
    },
    {
      id: 'ORD-2040-002', 
      date: '2025-01-03',
      status: 'processing',
      total: 299.99,
      items: 1
    }
  ]
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />
      case 'processing':
        return <ClockIcon className="w-5 h-5 text-yellow-400" />
      default:
        return <ShoppingBagIcon className="w-5 h-5 text-gray-400" />
    }
  }
  
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-8">My Orders</h1>
          
          <div className="space-y-4">
            {demoOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">{order.id}</h3>
                    <p className="text-gray-400 text-sm">{order.date}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(order.status)}
                      <span className="text-white capitalize">{order.status}</span>
                    </div>
                    <p className="text-cyan-400 font-bold">${order.total}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              🚧 Full order management features coming soon!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default OrdersPage
