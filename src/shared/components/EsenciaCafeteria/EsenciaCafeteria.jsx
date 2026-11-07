import { Coffee, Heart, Users } from 'lucide-react'
import './EsenciaCafeteria.css'

const caracteristicas = [
    {
        id: 1,
        icono: Coffee,
        titulo: 'Café de especialidad',
        descripcion: 'Seleccionamos café por su calidad y sabor.'
    },
    {
        id: 2,
        icono: Heart,
        titulo: 'Hecho con pasión',
        descripcion: 'Cuidamos cada detalle en la preparación.'
    },
    {
        id: 3,
        icono: Users,
        titulo: 'Momentos únicos',
        descripcion: 'Creamos un espacio para disfrutar y compartir.'
    }
]

function EsenciaCafeteria() {
    return (
        <section className="esencia">
            <div className="esencia__header">
                <span className="esencia__subtitle">LO QUE NOS DISTINGUE</span>
                <h2>Nuestra esencia</h2>
                <p>Más que café, una experiencia para disfrutar.</p>
            </div>

            <div className="esencia__grid">
                {caracteristicas.map((caracteristica) => {
                    const Icono = caracteristica.icono

                    return (
                        <article className="esencia__card" key={caracteristica.id}>
                            <div className="esencia__icon">
                                <Icono size={28} strokeWidth={1.7} />
                            </div>

                            <h3>{caracteristica.titulo}</h3>
                            <p>{caracteristica.descripcion}</p>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}

export default EsenciaCafeteria