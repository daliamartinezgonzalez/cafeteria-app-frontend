import { useAuthStore } from '@/features/auth/store/auth.store'

export function usePermissions() {
    const permissions = useAuthStore((state) => state.permissions)

    const hasPermission = (permission) => {
        return permissions.includes(permission)
    }

    const hasAnyPermission = (requiredPermissions) => {
        return requiredPermissions.some((permission) =>
            permissions.includes(permission)
        )
    }

    const hasAllPermissions = (requiredPermissions) => {
        return requiredPermissions.every((permission) =>
            permissions.includes(permission)
        )
    }

    return {
        permissions,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions
    }
}