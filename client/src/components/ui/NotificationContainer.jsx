import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import useUIStore from '../../store/uiStore'

const icons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon
}

const colors = {
  success: 'from-green-500 to-emerald-500',
  error: 'from-red-500 to-rose-500',
  warning: 'from-yellow-500 to-orange-500',
  info: 'from-blue-500 to-cyan-500'
}

const Notification = ({ notification }) => {
  const { removeNotification } = useUIStore()
  const Icon = icons[notification.type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
      className="bg-gray-800/90 backdrop-blur-lg border border-gray-700/50 rounded-xl p-4 shadow-xl max-w-sm w-full"
    >
      <div className="flex items-start gap-3">
        <div className={`p-1 rounded-lg bg-gradient-to-r ${colors[notification.type]}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          {notification.title && (
            <h4 className="text-white font-medium text-sm mb-1">
              {notification.title}
            </h4>
          )}
          <p className="text-gray-300 text-sm">
            {notification.message}
          </p>
        </div>
        
        <button
          onClick={() => removeNotification(notification.id)}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700/50"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
      
      {notification.duration > 0 && (
        <motion.div
          className={`h-1 bg-gradient-to-r ${colors[notification.type]} rounded-full mt-3`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: notification.duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  )
}

const NotificationContainer = () => {
  const { notifications } = useUIStore()

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <Notification key={notification.id} notification={notification} />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default NotificationContainer
