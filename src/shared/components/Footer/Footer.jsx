import { Link } from 'react-router-dom'
import { Coffee } from 'lucide-react'
import {
    FaInstagram,
    FaFacebookF,
    FaYoutube,
    FaEnvelope
} from 'react-icons/fa'
import './Footer.css'

// Enlaces de redes sociales
const REDES_POR_DEFECTO = [
    { nombre: 'Instagram', href: 'https://www.instagram.com/', Icono: FaInstagram },
    { nombre: 'Facebook', href: 'https://www.facebook.com/', Icono: FaFacebookF },
    { nombre: 'YouTube', href: 'https://www.youtube.com/', Icono: FaYoutube },
    { nombre: 'Correo', href: 'mailto:contacto@granoytaza.com', Icono: FaEnvelope }
]

// Enlaces de navegación
const COLUMNAS_POR_DEFECTO = [
    {
        titulo: 'Explora',
        enlaces: [
            { to: '#inicio', etiqueta: 'Inicio' },
            { to: '#nosotros', etiqueta: 'Nosotros' }
        ]
    },
    {
        titulo: 'Bebidas',
        enlaces: [
            { to: '#catalogo-bebidas', etiqueta: 'Catálogo de bebidas' }
        ]
    },
    {
        titulo: 'Cuenta',
        enlaces: [
            { to: '/login', etiqueta: 'Ingresar' }
        ]
    }
]

function Footer({
    social = REDES_POR_DEFECTO,
    columns = COLUMNAS_POR_DEFECTO,
    categorias = []
}) {
    const anioActual = new Date().getFullYear()

    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="footer__brand">
                    <Link className="footer__logo" to="/">
                        <span className="footer__logo-icon" aria-hidden="true">
                            <Coffee size={22} />
                        </span>
                        <span>Cafeteria</span>
                    </Link>

                    <p className="footer__description">
                        Descubre nuestra selección de bebidas y disfruta
                        del sabor de un buen café.
                    </p>

                    <ul className="footer__social">
                        {social.map((red) => {
                            const Icono = red.Icono

                            return (
                                <li key={red.nombre}>
                                    <a
                                        className="footer__social-link"
                                        href={red.href}
                                        aria-label={red.nombre}
                                        title={red.nombre}
                                        {...(red.href.startsWith('http')
                                            ? { target: '_blank', rel: 'noopener noreferrer' }
                                            : {})}
                                    >
                                        <Icono size={20} aria-hidden="true" />
                                    </a>
                                </li>
                            )
                        })}
                    </ul>

                    <p className="footer__legal">
                        © {anioActual} Cafeteria. Todos los derechos reservados.
                    </p>
                </div>

                <nav className="footer__columns" aria-label="Pie de página">
                    {columns.map((columna) => (
                        <div key={columna.titulo} className="footer__column">
                            <h3 className="footer__title">{columna.titulo}</h3>

                            <ul className="footer__list">
                                {columna.titulo === 'Bebidas' ? (
                                    <>
                                        {columna.enlaces.map((enlace) => (
                                            <li key={enlace.to}>
                                                <a className="footer__link" href={enlace.to}>
                                                    {enlace.etiqueta}
                                                </a>
                                            </li>
                                        ))}

                                        {categorias.map((categoria) => (
                                            <li key={categoria.id}>
                                                <Link
                                                    className="footer__link"
                                                    to={`/?categoria=${categoria.id}`}
                                                >
                                                    {categoria.nombre_categoria}
                                                </Link>
                                            </li>
                                        ))}
                                    </>
                                ) : (
                                    columna.enlaces.map((enlace) => (
                                        <li key={enlace.to}>
                                            {enlace.to.startsWith('#') ? (
                                                <a className="footer__link" href={enlace.to}>
                                                    {enlace.etiqueta}
                                                </a>
                                            ) : (
                                                <Link className="footer__link" to={enlace.to}>
                                                    {enlace.etiqueta}
                                                </Link>
                                            )}
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    ))}
                </nav>
            </div>
        </footer>
    )
}

export default Footer