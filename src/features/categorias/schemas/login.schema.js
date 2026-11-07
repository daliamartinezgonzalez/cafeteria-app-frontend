import { z } from 'zod'

export const categoriaSchema = z.object({
    nombre_categoria: z
        .string()
        .min(2, 'El nombre debe tener mínimo 2 caracteres')
        .max(50, 'El nombre no puede superar los 50 caracteres')
})

export const crearCategoriaSchema = categoriaSchema

export const editarCategoriaSchema = categoriaSchema