import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePermissions } from '@/features/auth/hooks/usePermissions'

export default function PermissionRoute({ permission, children }) {
    const { isLoading } = useAuth()
    const { hasPermission } = usePermissions()

    if (isLoading) {
        return <div>Cargando...</div>
    }

    if (!hasPermission(permission)) {
        return <Navigate to="/admin/inicio" replace />
    }

    return children
}