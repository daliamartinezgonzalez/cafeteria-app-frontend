import { createBrowserRouter, Link, Navigate } from 'react-router-dom'
import MainLayout from '@/shared/components/layouts/MainLayout'
import AdminLayoutWithPermissions from './AdminLayoutWithPermissions'
import LoginPage from '@/features/auth/pages/LoginPage'
import ProtectedRoute from './ProtectedRoute'
import PermissionRoute from './PermissionRoute'
import UsuariosPage from '@/features/usuarios/pages/UsuariosPage'

const ENLACES_PUBLICOS = [
    { to: '/', label: 'Menú', end: true },
    { to: '/nosotros', label: 'Nosotros' }
]

export const router = createBrowserRouter([
    {
        element: (
            <MainLayout
                links={ENLACES_PUBLICOS}
                acciones={
                    <Link className="navbar__accion" to="/login">
                        Ingresar
                    </Link>
                }
            />
        ),
        children: [
            { path: '/', element: <div>Menú de bebidas</div> },
            { path: '/recetas', element: <div>Recetas</div> },
            { path: '/nosotros', element: <div>Nosotros</div> },
            {
                path: '/login',
                handle: { anchoCompleto: true },
                element: <LoginPage />
            }
        ]
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AdminLayoutWithPermissions />,
                children: [
                    {
                        path: '/admin/inicio',
                        element: (
                            <PermissionRoute permission="inicio.ver">
                                <div>Inicio de administración</div>
                            </PermissionRoute>
                        )
                    },
                    {
                        path: '/admin/bebidas',
                        element: (
                            <PermissionRoute permission="bebidas.ver">
                                <div>Gestión de bebidas</div>
                            </PermissionRoute>
                        )
                    },
                    {
                        path: '/admin/categorias',
                        element: (
                            <PermissionRoute permission="categorias.ver">
                                <div>Gestión de categorías</div>
                            </PermissionRoute>
                        )
                    },
                    {
                        path: '/admin/ingredientes',
                        element: (
                            <PermissionRoute permission="ingredientes.ver">
                                <div>Gestión de ingredientes</div>
                            </PermissionRoute>
                        )
                    },
                    {
                        path: '/admin/usuarios',
                        element: (
                            <PermissionRoute permission="usuarios.ver">
                                <UsuariosPage/> 
                            </PermissionRoute>
                        )
                    }
                ]
            }
        ]
    },
    {
        path: '*',
        element: <Navigate to="/" replace />
    }
])