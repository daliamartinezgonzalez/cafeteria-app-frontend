import { useEffect } from 'react'
import { Outlet, useMatches, useLocation } from 'react-router-dom'
import Navbar from '@/shared/components/navbar/Navbar'
import './MainLayout.css'

const ENLACES_PRINCIPALES = [
    { to: '/#catalogo-bebidas', label: 'Menú' },
    { to: '/recetas', label: 'Recetas' },
    { to: '/#nosotros', label: 'Nosotros' }
]

export default function MainLayout({ links = ENLACES_PRINCIPALES, acciones }) {
    const anchoCompleto = useMatches().some((ruta) => ruta.handle?.anchoCompleto)
    const { pathname, hash } = useLocation()

    useEffect(() => {
        if (pathname !== '/' || !hash) return

        const id = decodeURIComponent(hash.slice(1))

        requestAnimationFrame(() => {
            document.getElementById(id)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        })
    }, [pathname, hash])

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