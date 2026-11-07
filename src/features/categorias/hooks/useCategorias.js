import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getCategorias,
    getCategoria,
    createCategoria,
    updateCategoria,
    deleteCategoria
} from '../api/categorias.api'

const categoriasKeys = {
    all: ['categorias'],
    lists: () => [...categoriasKeys.all, 'list'],
    detail: (id) => [...categoriasKeys.all, 'detail', id]
}

// para obtener todas las categorias
export function useCategorias() {
    return useQuery({
        queryKey: categoriasKeys.lists(),
        queryFn: getCategorias
    })
}

// para obtener una categoria por su id
export function useCategoria(id) {
    return useQuery({
        queryKey: categoriasKeys.detail(id),
        queryFn: () => getCategoria(id),
        enabled: !!id
    })
}

// para crear una categoria
export function useCreateCategoria() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createCategoria,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: categoriasKeys.all
            })
        }
    })
}

// para editar una categoria
export function useUpdateCategoria() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, datos }) => updateCategoria(id, datos),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: categoriasKeys.all
            })
            queryClient.invalidateQueries({
                queryKey: categoriasKeys.detail(variables.id)
            })
        }
    })
}

// para eliminar una categoria
export function useDeleteCategoria() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteCategoria,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: categoriasKeys.all
            })
        }
    })
}

// para guardar una categoria (crear o editar)
export function useGuardarCategoria() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, datos }) => {
            return id
                ? updateCategoria(id, datos)
                : createCategoria(datos)
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: categoriasKeys.all
            })

            if (variables.id) {
                queryClient.invalidateQueries({
                    queryKey: categoriasKeys.detail(variables.id)
                })
            }
        }
    })
}