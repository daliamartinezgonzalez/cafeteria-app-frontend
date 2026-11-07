
import { Link } from 'react-router-dom'
import { Coffee, Tags, Leaf, Users } from 'lucide-react'
import { usePermissions } from '@/features/auth/hooks/usePermissions'
import './InicioPage.css'

const ACCESOS = [
    {
        titulo: 'Bebidas',
        descripcion: 'Administra las bebidas del catálogo.',
        ruta: '/admin/bebidas',
        permiso: 'bebidas.ver',
        icono: Coffee
    },
    {
        titulo: 'Categorías',
        descripcion: 'Organiza las categorías de bebidas.',
        ruta: '/admin/categorias',
        permiso: 'categorias.ver',
        icono: Tags
    },
    {
        titulo: 'Ingredientes',
        descripcion: 'Gestiona los ingredientes disponibles.',
        ruta: '/admin/ingredientes',
        permiso: 'ingredientes.ver',
        icono: Leaf
    },
    {
        titulo: 'Usuarios',
        descripcion: 'Administra los usuarios del sistema.',
        ruta: '/admin/usuarios',
        permiso: 'usuarios.ver',
        icono: Users
    }
]

export default function InicioPage() {
    const { hasPermission } = usePermissions()

    const accesosDisponibles = ACCESOS.filter(
        (acceso) => hasPermission(acceso.permiso)
    )

    return (
        <section className="inicio-page">
            <header className="inicio-bienvenida">
                <div className="inicio-bienvenida__contenido">
                    <span className="inicio-bienvenida__etiqueta">
                        PANEL ADMINISTRATIVO
                    </span>

                    <h1>¡Bienvenido a Cafeteria!</h1>

                    <p>
                        Nos alegra tenerte aquí. Desde este espacio puedes
                        administrar y mantener actualizado el catálogo de
                        nuestra cafetería.
                    </p>
                </div>

                <div className="inicio-bienvenida__icono">
                    <Coffee size={76} strokeWidth={1.2} />
                </div>
            </header>

            <section className="inicio-accesos">
                <div className="inicio-seccion__encabezado">
                    <h2>Accesos rápidos</h2>
                    <p>Selecciona la sección que deseas administrar.</p>
                </div>

                <div className="inicio-accesos__grid">
                    {accesosDisponibles.map((acceso) => {
                        const Icono = acceso.icono

                        return (
                            <Link
                                key={acceso.ruta}
                                to={acceso.ruta}
                                className="inicio-acceso"
                            >
                                <div className="inicio-acceso__icono">
                                    <Icono size={25} />
                                </div>

                                <div className="inicio-acceso__contenido">
                                    <h3>{acceso.titulo}</h3>
                                    <p>{acceso.descripcion}</p>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </section>
        </section>
    )
}
