import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import LoadingSpinner from '../ui/LoadingSpinner'

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore()
  const location = useLocation()
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    )
  }
  
  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  if (user?.role !== 'admin') {
    // Redirect to home if not admin
    return <Navigate to="/" replace />
  }
  
  return children
}

export default AdminRoute
