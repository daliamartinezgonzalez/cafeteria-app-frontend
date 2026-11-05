import axios from 'axios'

const limpiarMensaje = (mensaje) => {
    if (typeof mensaje !== 'string') {
        return String(mensaje)
    }

    const traducciones = {
        'Field required': 'Este campo es obligatorio.',
        'field required': 'Este campo es obligatorio.',
        'Input should be a valid string': 'Debe ser un texto válido.',
        'Input should be a valid integer': 'Debe ser un número entero.',
        'Input should be a valid number': 'Debe ser un número válido.',
        'Input should be a valid boolean': 'Debe ser verdadero o falso.',
        'String should have at least 1 character': 'Este campo no puede estar vacío.',
        'value is not a valid email address': 'Ingresa un correo electrónico válido.'
    }

    const mensajeLimpio = mensaje
        .replace('Value error, ', '')
        .trim()

    return traducciones[mensajeLimpio] || mensajeLimpio
}

const obtenerCampo = (loc) => {
    if (!Array.isArray(loc)) return null

    const partes = loc.filter(
        (parte) =>
            typeof parte === 'string' &&
            !['body', 'query', 'path', 'header'].includes(parte)
    )

    return partes.length > 0 ? partes.join('.') : null
}

export function getApiError(error) {
    if (!axios.isAxiosError(error)) {
        return { general: 'Ocurrió un error inesperado.' }
    }

    const data = error.response?.data

    if (!data) {
        return { general: 'No se pudo conectar con el servidor.' }
    }

    const errores = {}

    // errores del back
    if (Array.isArray(data.errores)) {
        data.errores.forEach((item) => {
            const campo = item?.campo
            const mensaje = limpiarMensaje(item?.mensaje || 'Dato inválido.')

            if (campo) {
                errores[campo] = mensaje
            } else {
                errores.general = mensaje
            }
        })

        if (data.mensaje && Object.keys(errores).length === 0) {
            errores.general = limpiarMensaje(data.mensaje)
        }
    }

    // errores de validacion estándar de FastAPI
    else if (Array.isArray(data.detail)) {
        data.detail.forEach((item) => {
            const campo = obtenerCampo(item?.loc)
            const mensaje = limpiarMensaje(item?.msg || 'Dato inválido.')

            if (campo) {
                errores[campo] = mensaje
            } else {
                errores.general = mensaje
            }
        })
    } else if (typeof data.detail === 'string') {
        errores.general = limpiarMensaje(data.detail)
    } else if (typeof data.message === 'string') {
        errores.general = limpiarMensaje(data.message)
    } else if (typeof data.general === 'string') {
        errores.general = limpiarMensaje(data.general)
    }

    return Object.keys(errores).length > 0
        ? errores
        : { general: 'Ocurrió un error inesperado.' }
}