import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getUsuarios,
    getUsuario,
    getRoles,
    createUsuario,
    updateUsuario,
    patchUsuario,
    deleteUsuario
} from '../api/usuarios.api'

const usuariosKeys = {
    all: ['usuarios'],
    lists: () => [...usuariosKeys.all, 'list'],
    detail: (id) => [...usuariosKeys.all, 'detail', id]
}

const rolesKeys = {
    all: ['roles'],
    lists: () => [...rolesKeys.all, 'list'],
    detail: (id) => [...rolesKeys.all, 'detail', id]
}

export function useUsuarios() {
    return useQuery({
        queryKey: usuariosKeys.lists(),
        queryFn: getUsuarios
    })
}

export function useRoles() {
    return useQuery({
        queryKey: rolesKeys.lists(),
        queryFn: getRoles
    })
}

export function useUsuario(id) {
    return useQuery({
        queryKey: usuariosKeys.detail(id),
        queryFn: () => getUsuario(id),
        enabled: !!id
    })
}

export function useCreateUsuario() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createUsuario,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: usuariosKeys.all
            })
        }
    })
}

export function useUpdateUsuario() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, datos }) => updateUsuario(id, datos),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: usuariosKeys.all
            })
            queryClient.invalidateQueries({
                queryKey: usuariosKeys.detail(variables.id)
            })
        }
    })
}

export function usePatchUsuario() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, datos }) => patchUsuario(id, datos),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: usuariosKeys.all
            })
            queryClient.invalidateQueries({
                queryKey: usuariosKeys.detail(variables.id)
            })
        }
    })
}

export function useDeleteUsuario() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteUsuario,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: usuariosKeys.all
            })
        }
    })
}

export function useGuardarUsuario() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, datos }) => {
            return id
                ? updateUsuario(id, datos)
                : createUsuario(datos)
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: usuariosKeys.all
            })

            if (variables.id) {
                queryClient.invalidateQueries({
                    queryKey: usuariosKeys.detail(variables.id)
                })
            }
        }
    })
}