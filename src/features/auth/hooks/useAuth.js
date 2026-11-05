import { useAuthStore } from '../store/auth.store'

export function useAuth() {
    const token = useAuthStore((state) => state.token)
    const user = useAuthStore((state) => state.user)
    const permissions = useAuthStore((state) => state.permissions)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const isLoading = useAuthStore((state) => state.isLoading)
    const logout = useAuthStore((state) => state.logout)

    return {
        token,
        user,
        permissions,
        isAuthenticated,
        isLoading,
        logout
    }
}