import { Outlet, useMatches } from 'react-router-dom'
import Navbar from '@/shared/components/navbar/Navbar'
import './MainLayout.css'

const ENLACES_PRINCIPALES = [
    { to: '/', label: 'Menú', end: true },
    { to: '/recetas', label: 'Recetas' },
    { to: '/nosotros', label: 'Nosotros' }
]

export default function MainLayout({ links = ENLACES_PRINCIPALES, acciones }) {
    const anchoCompleto = useMatches().some((ruta) => ruta.handle?.anchoCompleto)

    return (
        <div className="main-layout">
            <Navbar links={links}>{acciones}</Navbar>

            <main
                className={`main-layout__contenido${anchoCompleto ? ' main-layout__contenido--completo' : ''}`}
            >
                <Outlet />
            </main>
        </div>
    )
}