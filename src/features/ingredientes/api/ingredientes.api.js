import { api } from '@/config/axios'

// para obtener todos los ingredientes
export async function getIngredientes() {
    const response = await api.get('/ingredientes/')
    return response.data
}

// para obtener un ingrediente por su id
export async function getIngrediente(id) {
    const response = await api.get(`/ingredientes/${id}`)
    return response.data
}

// para crear un nuevo ingrediente
export async function createIngrediente(datos) {
    const response = await api.post('/ingredientes/', datos)
    return response.data
}

// para editar un ingrediente
export async function updateIngrediente(id, datos) {
    const response = await api.put(`/ingredientes/${id}`, datos)
    return response.data
}

// para eliminar un ingrediente
export async function deleteIngrediente(id) {
    const response = await api.delete(`/ingredientes/${id}`)
    return response.data
}