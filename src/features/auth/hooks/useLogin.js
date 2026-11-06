import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { loginRequest, getProfile } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'
import { authKeys } from '../queries/auth.keys'
import { decodeToken } from '../utils/decode-token'

export function useLogin() {
    const navigate = useNavigate()
    const setPermissions = useAuthStore((state) => state.setPermissions)
    const setToken = useAuthStore((state) => state.setToken)
    const setUser = useAuthStore((state) => state.setUser)
    const logout = useAuthStore((state) => state.logout)

    return useMutation({
        mutationKey: authKeys.all,

        mutationFn: async ({ email, password }) => {
            const login = await loginRequest(email, password)

            setToken(login.access_token)

            try {
                const datosToken = decodeToken(login.access_token)
                const user = await getProfile()

                setUser(user)
                setPermissions(datosToken.permisos ?? [])

                return user
            } catch (error) {
                logout()
                throw error
            }
        },

        onSuccess: () => {
            navigate('/admin/inicio')
        }
    })
}