import { motion } from 'framer-motion'
import { 
  CreditCardIcon, 
  ShieldCheckIcon, 
  TruckIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import useCartStore from '../store/cartStore'

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCartStore()
  
  const handlePlaceOrder = () => {
    // Simulate order placement
    alert('Order placed successfully! (Demo)')
    clearCart()
  }
  
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <Link to="/cart">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeftIcon className="w-4 h-4" />}>
                Back to Cart
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-white">Checkout</h1>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-cyber-blue to-neon-purple rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCardIcon className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-2xl font-semibold text-white mb-4">Secure Quantum Checkout</h2>
            <p className="text-gray-400 mb-8">
              Experience the future of payments with neural-encrypted transactions
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <ShieldCheckIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-white font-medium">Quantum Secure</p>
              </div>
              <div className="text-center">
                <TruckIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-white font-medium">Instant Delivery</p>
              </div>
              <div className="text-center">
                <CheckCircleIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-white font-medium">AI Verified</p>
              </div>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 mb-8">
              <h3 className="text-white font-semibold mb-4">Order Summary</h3>
              <div className="flex justify-between text-gray-400 mb-2">
                <span>Items ({items.length})</span>
                <span>${totalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 mb-2">
                <span>Quantum Tax</span>
                <span>${(totalPrice() * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-700 pt-2">
                <div className="flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span>${(totalPrice() * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <Button onClick={handlePlaceOrder} size="lg" className="w-full mb-4">
              Place Order (Demo)
            </Button>
            
            <p className="text-gray-400 text-sm">
              🚧 Full checkout system with payment processing coming soon!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CheckoutPage
