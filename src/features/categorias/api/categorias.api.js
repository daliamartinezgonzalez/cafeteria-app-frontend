import { api } from '@/config/axios'

// para obtener todas las categorias
export async function getCategorias() {
    const response = await api.get('/categorias/')
    return response.data
}

// para obtener una categoria por su id
export async function getCategoria(id) {
    const response = await api.get(`/categorias/${id}`)
    return response.data
}

// para crear una nueva categoria
export async function createCategoria(datos) {
    const response = await api.post('/categorias/', datos)
    return response.data
}

// para editar una categoria
export async function updateCategoria(id, datos) {
    const response = await api.put(`/categorias/${id}`, datos)
    return response.data
}

// para eliminar una categoria
export async function deleteCategoria(id) {
    const response = await api.delete(`/categorias/${id}`)
    return response.data
}