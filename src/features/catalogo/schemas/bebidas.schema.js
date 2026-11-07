import { z } from 'zod'

const ingredienteSchema = z.object({
    id_ingrediente: z.coerce.number({
        invalid_type_error: 'Selecciona un ingrediente.'
    }).int().gt(0, 'Selecciona un ingrediente.'),
    cantidad: z.coerce.number({
        invalid_type_error: 'Ingresa una cantidad válida.'
    }).gt(0, 'La cantidad debe ser mayor a cero.'),
    unidad: z.string()
        .min(1, 'Ingresa la unidad.')
        .max(20, 'La unidad no puede superar los 20 caracteres.')
})

const bebidaSchema = z.object({
    nombre: z.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres.')
        .max(100, 'El nombre no puede superar los 100 caracteres.'),

    descripcion: z.string()
        .max(255, 'La descripción no puede superar los 255 caracteres.'),

    precio: z.coerce.number()
        .gt(0, 'El precio debe ser mayor a cero.'),

    tamaño: z.string()
        .min(1, 'Ingresa el tamaño.')
        .max(30, 'El tamaño no puede superar los 30 caracteres.'),

    imagen_url: z.string()
        .min(1, 'Ingresa la URL de la imagen.')
        .max(255, 'La URL no puede superar los 255 caracteres.'),

    id_categoria: z.coerce.number()
        .int()
        .gt(0, 'Selecciona una categoría.'),

    ingredientes: z.array(ingredienteSchema)
        .min(1, 'Agrega al menos un ingrediente.')
})

export const crearBebidaSchema = bebidaSchema
export const editarBebidaSchema = bebidaSchema