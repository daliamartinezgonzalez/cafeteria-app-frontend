import { api } from '@/config/axios'

export async function loginRequest(email, password) {
    const response = await api.post('/auth/login', {
        email,
        password
    })

    return response.data
}

export async function getProfile() {
    const response = await api.get('/auth/me')
    return response.data
}