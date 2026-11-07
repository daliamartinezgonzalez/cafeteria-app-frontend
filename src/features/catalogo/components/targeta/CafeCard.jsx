import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import './CafeCard.css'

// componente para mostrar el icono de una taza de café
export function IconoTaza({ size = 40 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M17 6c-2 2.5 2 4 0 7" />
            <path d="M25 6c-2 2.5 2 4 0 7" />
            <path d="M9 19h26v9a10 10 0 0 1-10 10h-6A10 10 0 0 1 9 28v-9Z" />
            <path d="M35 21h2.5a4.5 4.5 0 0 1 0 9H34" />
            <path d="M12 43h20" />
        </svg>
    )
}

// componente reutilizable para mostrar la información de una bebida
export default function CafeCard({
    nombre = 'Espresso doble',
    categoria = 'Caliente',
    descripcion = '',
    precio = 45,
    moneda = '$',
    imagen,
    icono,
    ingredientes = [],
    tono = 'durazno',
    puedeEditar = false,
    puedeEliminar = false,
    onEditar,
    onEliminar
}) {
    // estado para controlar la visibilidad del modal de receta
    const [mostrarReceta, setMostrarReceta] = useState(false)

    return (
        <article className={`cafe-card cafe-card--${tono}`}>
            <div className="cafe-card__imagen">
                {/* muestra la imagen o el icono de la bebida */}
                {imagen ? (
                    <img src={imagen} alt={nombre} />
                ) : (
                    icono ?? <IconoTaza />
                )}

                {/* muestra el precio de la bebida */}
                <span className="cafe-card__precio">
                    {moneda}{precio}
                </span>
            </div>

            {/* información general de la bebida */}
            <div className="cafe-card__cuerpo">
                <p className="cafe-card__categoria">{categoria}</p>
                <h3 className="cafe-card__nombre">{nombre}</h3>
                <p className="cafe-card__descripcion">{descripcion}</p>
            </div>

            {/* botones de acciones de la tarjeta */}
            <div className="cafe-card__acciones">
                <button
                    type="button"
                    className="cafe-card__receta"
                    onClick={() => setMostrarReceta(true)}
                >
                    Ver receta
                </button>

                {/* muestra los botones de administración según los permisos */}
                {(puedeEditar || puedeEliminar) && (
                    <div className="cafe-card__administracion">
                        {/* botón para editar la bebida */}
                        {puedeEditar && (
                            <button
                                type="button"
                                className="cafe-card__accion cafe-card__accion--editar"
                                onClick={onEditar}
                                aria-label={`Editar ${nombre}`}
                                title="Editar bebida"
                            >
                                <Pencil size={17} />
                            </button>
                        )}

                        {/* botón para eliminar la bebida */}
                        {puedeEliminar && (
                            <button
                                type="button"
                                className="cafe-card__accion cafe-card__accion--eliminar"
                                onClick={onEliminar}
                                aria-label={`Eliminar ${nombre}`}
                                title="Eliminar bebida"
                            >
                                <Trash2 size={17} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* muestra el modal cuando se solicita consultar la receta */}
            {mostrarReceta && (
                <div
                    className="cafe-card__modal-overlay"
                    onClick={() => setMostrarReceta(false)}
                >
                    <section
                        className="cafe-card__modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="receta-titulo"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* botón para cerrar el modal */}
                        <button
                            type="button"
                            className="cafe-card__modal-cerrar"
                            onClick={() => setMostrarReceta(false)}
                            aria-label="Cerrar receta"
                        >
                            ×
                        </button>

                        {/* nombre y categoría de la bebida */}
                        <p className="cafe-card__categoria">{categoria}</p>
                        <h2 id="receta-titulo">Receta de {nombre}</h2>

                        <h3>Ingredientes</h3>

                        {/* muestra los ingredientes registrados o un mensaje si no hay ninguno */}
                        {ingredientes.length === 0 ? (
                            <p>No hay ingredientes registrados para esta bebida.</p>
                        ) : (
                            <ul className="cafe-card__ingredientes">
                                {/* recorre la lista para mostrar cada ingrediente y su cantidad */}
                                {ingredientes.map((ingrediente) => (
                                    <li key={ingrediente.id_ingrediente}>
                                        <span>{ingrediente.nombre}</span>
                                        <strong>
                                            {ingrediente.cantidad} {ingrediente.unidad}
                                        </strong>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            )}
        </article>
    )
}