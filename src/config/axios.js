import axios from 'axios'
import { useAuthStore } from '@/features/auth/store/auth.store'

// Configuración de Axios para las solicitudes al backend.
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})
// Agrega automáticamente el token JWT a las solicitudes 
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})
// cierra la sesión cuando el backend responde que la autenticación ya no es valida
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout()
        }

        return Promise.reject(error)
    }
)