import { useState } from 'react'
import './Baristas.css'

const baristas = [
    {
        id: 1,
        nombre: 'Ana López',
        descripcion: 'Especialista en café de especialidad. Disfruta experimentar con diferentes métodos de extracción.'
    },
    {
        id: 2,
        nombre: 'Carlos Méndez',
        descripcion: 'Apasionado por el arte del café y la preparación de bebidas con técnicas tradicionales.'
    },
    {
        id: 3,
        nombre: 'María García',
        descripcion: 'Amante del café y de crear experiencias únicas a través de cada taza.'
    }
]

function obtenerIniciales(nombre) {
    return nombre
        .split(' ')
        .map((palabra) => palabra[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
}

function Baristas() {
    const [baristaSeleccionado, setBaristaSeleccionado] = useState(0)

    const barista = baristas[baristaSeleccionado]

    return (
        <section className="baristas">
            <div className="baristas__header">
                <span className="baristas__subtitle">CONOCE A NUESTRO EQUIPO</span>
                <h2>Nuestros baristas</h2>
                <p>Las personas detrás de cada taza.</p>
            </div>

            <div className="baristas__circles">
                {baristas.map((persona, index) => (
                    <button
                        key={persona.id}
                        type="button"
                        className={`baristas__circle ${
                            baristaSeleccionado === index
                                ? 'baristas__circle--active'
                                : ''
                        }`}
                        onClick={() => setBaristaSeleccionado(index)}
                        aria-label={`Conocer a ${persona.nombre}`}
                        aria-pressed={baristaSeleccionado === index}
                    >
                        {obtenerIniciales(persona.nombre)}
                    </button>
                ))}
            </div>

            <div className="baristas__information" aria-live="polite">
                <h3>{barista.nombre}</h3>
                <p>{barista.descripcion}</p>
            </div>
        </section>
    )
}

export default Baristas