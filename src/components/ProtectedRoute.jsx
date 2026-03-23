import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-brand-ink/40">
        Chargement...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/connexion" state={{ from: location.pathname }} replace />
  }

  return children
}

export default ProtectedRoute
