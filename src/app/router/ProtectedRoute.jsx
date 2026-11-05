import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return <div>Cargando...</div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}