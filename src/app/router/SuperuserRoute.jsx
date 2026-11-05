import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function SuperuserRoute({ children }) {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return <div>Cargando...</div>
    }

    if (!user?.is_superuser) {
        return <Navigate to="/admin/inicio" replace />
    }

    return children
}