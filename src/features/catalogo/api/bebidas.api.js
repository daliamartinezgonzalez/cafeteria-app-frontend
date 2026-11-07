import { api } from '@/config/axios'

// llamada a la api para mostrar todas las bebidas
export async function getBebidas() {
    const response = await api.get('/bebidas/')
    return response.data
}

// llamada a la api para filtrar por id y mostrar una bebida
export async function getBebida(id) {
    const response = await api.get(`/bebidas/${id}`)
    return response.data
}

// llamada a la api para registrar una nueva bebida
export async function createBebida(datos) {
    const response = await api.post('/bebidas/', datos)
    return response.data
}

// llamada a la api para actualizar todos los datos de una bebida
export async function updateBebida(id, datos) {
    const response = await api.put(`/bebidas/${id}`, datos)
    return response.data
}

// llamada a la api para actualizar solo algunos datos de una bebida
export async function patchBebida(id, datos) {
    const response = await api.patch(`/bebidas/${id}`, datos)
    return response.data
}

// llamada a la api para eliminar una bebida por su id
export async function deleteBebida(id) {
    const response = await api.delete(`/bebidas/${id}`)
    return response.data
}