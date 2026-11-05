/**
 * Respuesta del inicio de sesión.
 * @typedef {Object} LoginResponse
 * @property {string} access_token
 * @property {string} token_type
 */

/**
 * Perfil del usuario autenticado.
 * @typedef {Object} ProfileResponse
 * @property {number} id_usuario
 * @property {string} nom_usuario
 * @property {string} nombre
 * @property {string} apellido_p
 * @property {string|null} apellido_m
 * @property {string} correo
 * @property {number} id_rol
 * @property {boolean} activo
 * @property {string} nombre_rol
 */