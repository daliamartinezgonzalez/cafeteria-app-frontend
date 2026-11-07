import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getIngredientes,
    getIngrediente,
    createIngrediente,
    updateIngrediente,
    deleteIngrediente
} from '../api/ingredientes.api'

const ingredientesKeys = {
    all: ['ingredientes'],
    lists: () => [...ingredientesKeys.all, 'list'],
    detail: (id) => [...ingredientesKeys.all, 'detail', id]
}

// para obtener todos los ingredientes
export function useIngredientes() {
    return useQuery({
        queryKey: ingredientesKeys.lists(),
        queryFn: getIngredientes
    })
}

// para obtener un ingrediente por su id
export function useIngrediente(id) {
    return useQuery({
        queryKey: ingredientesKeys.detail(id),
        queryFn: () => getIngrediente(id),
        enabled: !!id
    })
}

// para crear un ingrediente
export function useCreateIngrediente() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createIngrediente,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ingredientesKeys.all
            })
        }
    })
}

// para editar un ingrediente
export function useUpdateIngrediente() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, datos }) => updateIngrediente(id, datos),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ingredientesKeys.all
            })
            queryClient.invalidateQueries({
                queryKey: ingredientesKeys.detail(variables.id)
            })
        }
    })
}

// para eliminar un ingrediente
export function useDeleteIngrediente() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteIngrediente,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ingredientesKeys.all
            })
        }
    })
}

// para guardar un ingrediente (crear o editar)
export function useGuardarIngrediente() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, datos }) => {
            return id
                ? updateIngrediente(id, datos)
                : createIngrediente(datos)
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ingredientesKeys.all
            })

            if (variables.id) {
                queryClient.invalidateQueries({
                    queryKey: ingredientesKeys.detail(variables.id)
                })
            }
        }
    })
}