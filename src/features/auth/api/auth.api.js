import { api } from '@/config/axios'

// envia las credenciales al backend para iniciar sesión y obtener el token de acceso
export async function loginRequest(email, password) {
    const response = await api.post('/auth/login', {
        email,
        password
    })

    return response.data
}
// obtiene la información del usuario que tiene una sesión autenticada
export async function getProfile() {
    const response = await api.get('/auth/me')
    return response.data
}