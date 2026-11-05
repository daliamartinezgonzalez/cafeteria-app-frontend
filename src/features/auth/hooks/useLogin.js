import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { loginRequest, getProfile } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'
import { authKeys } from '../queries/auth.keys'

export function useLogin() {
    const navigate = useNavigate()
    const setPermissions = useAuthStore((state) => state.setPermissions)
    const setToken = useAuthStore((state) => state.setToken)
    const setUser = useAuthStore((state) => state.setUser)

    return useMutation({
        mutationKey: authKeys.all,

        mutationFn: async ({ email, password }) => {
            const login = await loginRequest(email, password)

            setToken(login.access_token)

            const user = await getProfile()

            setUser(user)
            setPermissions(user.permisos ?? [])

            return user
        },

        onSuccess: () => {
            navigate('/admin/inicio')
        }
    })
}