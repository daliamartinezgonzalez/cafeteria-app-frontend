import { useNavigate } from 'react-router-dom'
import MainLayout from './MainLayout'
import { useAuthStore } from '@/features/auth/store/auth.store'

const ENLACES_ADMIN = [
    { to: '/admin/inicio', label: 'Inicio' },
    { to: '/admin/bebidas', label: 'Bebidas' },
    { to: '/admin/categorias', label: 'Categorias' },
    { to: '/admin/ingredientes', label: 'Ingredientes' },
    { to: '/admin/usuarios', label: 'Usuarios' }
]

export default function AdminLayout() {
    const navigate = useNavigate()
    const logout = useAuthStore((state) => state.logout)

    const cerrarSesion = () => {
        logout()
        navigate('/login', { replace: true })
    }

    return (
        <MainLayout
            links={ENLACES_ADMIN}
            acciones={
                <button
                    type="button"
                    className="navbar__accion"
                    onClick={cerrarSesion}
                >
                    Salir
                </button>
            }
        />
    )
}