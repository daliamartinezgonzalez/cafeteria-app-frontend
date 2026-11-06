import { z } from 'zod'

const usuarioBaseSchema = z.object({
    nombre: z
        .string()
        .min(2, 'El nombre debe tener mínimo 2 caracteres')
        .max(50, 'El nombre no puede superar los 50 caracteres'),

    apellido_p: z
        .string()
        .min(2, 'El apellido paterno debe tener mínimo 2 caracteres')
        .max(50, 'El apellido paterno no puede superar los 50 caracteres'),

    apellido_m: z
        .string()
        .max(50, 'El apellido materno no puede superar los 50 caracteres')
        .optional()
        .or(z.literal('')),

    email: z
        .string()
        .min(1, 'El correo es requerido')
        .email('Ingresa un correo electrónico válido'),

    id_rol: z.coerce
        .number()
        .int('Selecciona un rol válido')
        .positive('Selecciona un rol')
})

export const crearUsuarioSchema = usuarioBaseSchema.extend({
    password: z
        .string()
        .min(8, 'La contraseña debe tener mínimo 8 caracteres')
        .max(64, 'La contraseña no puede superar los 64 caracteres')
})

export const editarUsuarioSchema = usuarioBaseSchema.extend({
    password: z
        .string()
        .max(64, 'La contraseña no puede superar los 64 caracteres')
        .refine(
            (password) => password === '' || password.length >= 8,
            'La contraseña debe tener mínimo 8 caracteres'
        )
        .optional()
})

export const usuarioSchema = crearUsuarioSchema