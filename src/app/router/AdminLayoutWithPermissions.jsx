import AdminLayout from '@/shared/components/layouts/AdminLayout'
import { usePermissions } from '@/features/auth/hooks/usePermissions'

export default function AdminLayoutWithPermissions() {
    // permite leer los permisos
    const { hasPermission } = usePermissions()

    // enlaces disponibles para el panel administrativo
    const enlaces = [
        { to: '/admin/inicio', label: 'Inicio' },
        { to: '/admin/bebidas', label: 'Bebidas', permission: 'bebidas.ver' },
        { to: '/admin/categorias', label: 'Categorías', permission: 'categorias.ver' },
        { to: '/admin/ingredientes', label: 'Ingredientes', permission: 'ingredientes.ver' },
        { to: '/admin/usuarios', label: 'Usuarios', permission: 'usuarios.ver' }
    ]

    // muestra los enlaces que no requieren permiso o cuyo permiso está asignado al usuario
    const enlacesPermitidos = enlaces.filter(
        (enlace) => !enlace.permission || hasPermission(enlace.permission)
    )

    return <AdminLayout links={enlacesPermitidos} />
}