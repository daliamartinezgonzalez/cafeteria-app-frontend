import { useEffect } from 'react'
import { getProfile } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'

export function useAuthBootstrap() {
    const token = useAuthStore((state) => state.token)
    const setUser = useAuthStore((state) => state.setUser)
    const setLoading = useAuthStore((state) => state.setLoading)
    const logout = useAuthStore((state) => state.logout)

    useEffect(() => {
        async function loadUser() {
            if (!token) {
                setLoading(false)
                return
            }

            try {
                const user = await getProfile()
                setUser(user)
            } catch (error) {
                console.error('Error restaurando sesión', error)
                logout()
            } finally {
                setLoading(false)
            }
        }

        loadUser()
    }, [token, setUser, setLoading, logout])
}