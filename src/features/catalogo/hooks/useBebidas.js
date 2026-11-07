import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getBebidas,
    getBebida,
    createBebida,
    updateBebida,
    patchBebida,
    deleteBebida
} from '../api/bebidas.api'

const bebidasKeys = {
    all: ['bebidas'],
    lists: () => [...bebidasKeys.all, 'list'],
    detail: (id) => [...bebidasKeys.all, 'detail', id]
}

export function useBebidas() {
    return useQuery({
        queryKey: bebidasKeys.lists(),
        queryFn: getBebidas
    })
}

export function useBebida(id) {
    return useQuery({
        queryKey: bebidasKeys.detail(id),
        queryFn: () => getBebida(id),
        enabled: !!id
    })
}

export function useCreateBebida() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createBebida,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: bebidasKeys.all
            })
        }
    })
}

export function useUpdateBebida() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, datos }) => updateBebida(id, datos),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: bebidasKeys.all
            })
            queryClient.invalidateQueries({
                queryKey: bebidasKeys.detail(variables.id)
            })
        }
    })
}

export function usePatchBebida() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, datos }) => patchBebida(id, datos),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: bebidasKeys.all
            })
            queryClient.invalidateQueries({
                queryKey: bebidasKeys.detail(variables.id)
            })
        }
    })
}

export function useDeleteBebida() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteBebida,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: bebidasKeys.all
            })
        }
    })
}

export function useGuardarBebida() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, datos }) => {
            return id
                ? updateBebida(id, datos)
                : createBebida(datos)
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: bebidasKeys.all
            })

            if (variables.id) {
                queryClient.invalidateQueries({
                    queryKey: bebidasKeys.detail(variables.id)
                })
            }
        }
    })
}