import { api } from '@/config/axios'

export async function getUsuarios() {
    const response = await api.get('/usuarios/')
    return response.data
}

export async function getRoles() {
    const response = await api.get('/roles/')
    return response.data
}

export async function getUsuario(id) {
    const response = await api.get(`/usuarios/${id}`)
    return response.data
}

export async function createUsuario(datos) {
    const response = await api.post('/usuarios/', datos)
    return response.data
}

export async function updateUsuario(id, datos) {
    const response = await api.put(`/usuarios/${id}`, datos)
    return response.data
}

export async function patchUsuario(id, datos) {
    const response = await api.patch(`/usuarios/${id}`, datos)
    return response.data
}

export async function deleteUsuario(id) {
    const response = await api.delete(`/usuarios/${id}`)
    return response.data
}