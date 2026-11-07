import { z } from 'zod'

export const ingredienteSchema = z.object({
    nombre: z
        .string()
        .min(2, 'El nombre debe tener mínimo 2 caracteres')
        .max(50, 'El nombre no puede superar los 50 caracteres')
})

export const crearIngredienteSchema = ingredienteSchema

export const editarIngredienteSchema = ingredienteSchema