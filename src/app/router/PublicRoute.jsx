import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function PublicRoute({ children }) {
    const { isAuthenticated } = useAuth()

    // Si ya inició sesión, redirige al panel administrativo.
    if (isAuthenticated) {
        return <Navigate to="/admin/inicio" replace />
    }

    return children
}
