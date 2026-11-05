import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Coffee, Menu, X } from 'lucide-react'
import './Navbar.css'

export default function Navbar({ marca = 'Cafeteria', links = [], children }) {
    const [abierto, setAbierto] = useState(false)

    useEffect(() => {
        if (!abierto) return undefined
        const cerrarConEscape = (evento) => {
            if (evento.key === 'Escape') setAbierto(false)
        }
        window.addEventListener('keydown', cerrarConEscape)
        return () => window.removeEventListener('keydown', cerrarConEscape)
    }, [abierto])

    return (
        <header className="navbar">
            <div className="navbar__contenido">
                <Link className="navbar__marca" to="/" onClick={() => setAbierto(false)}>
                    <span className="navbar__logo" aria-hidden="true">
                        <Coffee size={22} />
                    </span>
                    <span className="navbar__nombre">{marca}</span>
                </Link>

                <button
                    type="button"
                    className="navbar__toggle"
                    onClick={() => setAbierto((prev) => !prev)}
                    aria-expanded={abierto}
                    aria-controls="navbar-menu"
                    aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
                >
                    {abierto
                        ? <X size={22} aria-hidden="true" />
                        : <Menu size={22} aria-hidden="true" />
                    }
                </button>

                <nav
                    id="navbar-menu"
                    className={`navbar__menu${abierto ? ' navbar__menu--abierto' : ''}`}
                    aria-label="Principal"
                >
                    <ul className="navbar__links">
                        {links.map((link) => (
                            <li key={link.to}>
                                <NavLink
                                    to={link.to}
                                    end={link.end}
                                    className={({ isActive }) =>
                                        `navbar__link${isActive ? ' navbar__link--activo' : ''}`
                                    }
                                    onClick={() => setAbierto(false)}
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {children && <div className="navbar__acciones">{children}</div>}
                </nav>
            </div>
        </header>
    )
}
