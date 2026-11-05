import { createBrowserRouter, Link, Navigate } from 'react-router-dom'
import MainLayout from '@/shared/components/layouts/MainLayout'
import AdminLayout from '@/shared/components/layouts/AdminLayout'
import LoginPage from '@/features/auth/pages/LoginPage'
import ProtectedRoute from './ProtectedRoute'

const ENLACES_PUBLICOS = [
    { to: '/', label: 'Menú', end: true },
    { to: '/nosotros', label: 'Nosotros' }
]

export const router = createBrowserRouter([
    // Páginas públicas
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

    // Zona administrativa: requiere autenticación
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    {
                        path: '/admin/inicio',
                        element: <div>Inicio de administración</div>
                    },
                    {
                        path: '/admin/bebidas',
                        element: <div>Gestión de bebidas</div>
                    },
                    {
                        path: '/admin/usuarios',
                        element: <div>Gestión de usuarios</div>
                    }
                ]
            }
        ]
    },

    // Cualquier otra ruta vuelve al menú público
    {
        path: '*',
        element: <Navigate to="/" replace />
    }
])