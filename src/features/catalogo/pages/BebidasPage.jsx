import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader/PageHeader'
import FilterSelect from '@/shared/components/FilterSelect/FilterSelect'
import Modal from '@/shared/components/Modal/Modal'
import Button from '@/shared/components/Button/Button'
import ConfirmDialog from '@/shared/components/ConfirmDialog/ConfirmDialog'
import ResultDialog from '@/shared/components/ResultDialog/ResultDialog'
import Footer from '@/shared/components/Footer/Footer'

import CafeCard from '../components/targeta/CafeCard'
import BebidaForm from '../components/form/BebidaForm'
import { useBebidas, useGuardarBebida, useDeleteBebida } from '../hooks/useBebidas'
import { useCategorias } from '@/features/categorias/hooks/useCategorias'
import { usePermissions } from '@/features/auth/hooks/usePermissions'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getApiError } from '@/shared/utils/api-error'
import './BebidasPage.css'
import NosotrosPage from '../components/NosotrosPage'

export default function BebidasPage() {
    // estados para controlar el modal, la bebida seleccionada y las acciones pendientes
    const [searchParams, setSearchParams] = useSearchParams()
    const [modalAbierto, setModalAbierto] = useState(false)
    const [bebidaSeleccionada, setBebidaSeleccionada] = useState(null)
    const [accion, setAccion] = useState(null)
    const [datosPendientes, setDatosPendientes] = useState(null)
    const [resultado, setResultado] = useState({
        abierto: false,
        tipo: 'success',
        titulo: '',
        mensaje: ''
    })

    // obtiene la categoría seleccionada desde los parámetros de la URL
    const categoriaSeleccionada = searchParams.get('categoria') ?? ''

    // consultas y mutaciones para administrar bebidas y categorías
    const { data: bebidas = [], isLoading, isError } = useBebidas()
    const { data: categorias = [] } = useCategorias()
    const guardarBebida = useGuardarBebida()
    const eliminarBebida = useDeleteBebida()

    // obtiene los permisos y el estado de autenticación del usuario
    const { hasPermission } = usePermissions()
    const { isAuthenticated } = useAuth()

    // verifica los permisos para crear, editar y eliminar bebidas
    const puedeCrear = hasPermission('bebidas.crear')
    const puedeEditar = hasPermission('bebidas.editar')
    const puedeEliminar = hasPermission('bebidas.eliminar')

    // desplaza la página hasta el catálogo cuando se selecciona una categoría
    useEffect(() => {
        if (categoriaSeleccionada) {
            document.getElementById('catalogo-bebidas')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
    }, [categoriaSeleccionada])

    // convierte las categorías en opciones para el selector de filtros
    const opcionesCategorias = categorias.map((categoria) => ({
        value: String(categoria.id),
        label: categoria.nombre_categoria
    }))

    // filtra las bebidas según la categoría seleccionada
    const bebidasFiltradas = categoriaSeleccionada
        ? bebidas.filter((bebida) => {
            const idCategoria =
                bebida.categoria_id ??
                bebida.id_categoria ??
                bebida.categoria?.id

            return String(idCategoria) === categoriaSeleccionada
        })
        : bebidas

    // abre el modal para registrar una nueva bebida
    const abrirModalCrear = () => {
        setBebidaSeleccionada(null)
        setModalAbierto(true)
    }

    // abre el modal con los datos de la bebida seleccionada para editarla
    const abrirModalEditar = (bebida) => {
        setBebidaSeleccionada(bebida)
        setModalAbierto(true)
    }

    // prepara la confirmación para eliminar una bebida
    const abrirConfirmacionEliminar = (bebida) => {
        setAccion({
            tipo: 'eliminar',
            bebida
        })
    }

    // cierra el modal y limpia los estados del formulario
    const cerrarModal = () => {
        if (guardarBebida.isPending) return

        setModalAbierto(false)
        setBebidaSeleccionada(null)
        setDatosPendientes(null)
        guardarBebida.reset()
    }

    // muestra el resultado de una operación
    const mostrarResultado = (tipo, titulo, mensaje) => {
        setResultado({
            abierto: true,
            tipo,
            titulo,
            mensaje
        })
    }

    // obtiene y organiza los mensajes de error devueltos por la api
    const mostrarError = (error) => {
        const errores = getApiError(error)

        const mensaje = [
            errores.general,
            ...Object.entries(errores)
                .filter(([campo]) => campo !== 'general')
                .map(([campo, texto]) => `${campo}: ${texto}`)
        ].filter(Boolean).join('\n')

        mostrarResultado(
            'error',
            'No se pudo completar la operación',
            mensaje || 'Ocurrió un error inesperado.'
        )
    }

    // guarda los datos del formulario y prepara la confirmación
    const enviarFormulario = (datos) => {
        setDatosPendientes(datos)
        setAccion({
            tipo: 'guardar',
            bebida: bebidaSeleccionada
        })
    }

    // cierra el diálogo de confirmación y limpia los datos pendientes
    const cerrarConfirmacion = () => {
        if (guardarBebida.isPending || eliminarBebida.isPending) {
            return
        }

        setAccion(null)

        if (accion?.tipo === 'guardar') {
            setDatosPendientes(null)
        }
    }

    // ejecuta la operación seleccionada después de confirmar
    const confirmarAccion = () => {
        if (!accion) return

        const { tipo, bebida } = accion

        // registra una nueva bebida o actualiza una existente
        if (tipo === 'guardar') {
            guardarBebida.mutate(
                {
                    id: bebida?.id,
                    datos: datosPendientes
                },
                {
                    // muestra un mensaje cuando la operación se completa correctamente
                    onSuccess: () => {
                        setAccion(null)
                        setDatosPendientes(null)
                        setModalAbierto(false)
                        setBebidaSeleccionada(null)
                        guardarBebida.reset()

                        mostrarResultado(
                            'success',
                            bebida ? 'Bebida actualizada' : 'Bebida creada',
                            bebida
                                ? 'Los datos de la bebida se actualizaron correctamente.'
                                : 'La bebida se registró correctamente.'
                        )
                    },
                    // muestra el mensaje de error si falla el registro o la actualización
                    onError: (error) => {
                        setAccion(null)
                        setDatosPendientes(null)
                        mostrarError(error)
                    }
                }
            )

            return
        }

        // elimina la bebida seleccionada
        if (tipo === 'eliminar') {
            eliminarBebida.mutate(bebida.id, {
                // muestra un mensaje cuando la bebida se elimina correctamente
                onSuccess: () => {
                    setAccion(null)

                    mostrarResultado(
                        'success',
                        'Bebida eliminada',
                        `La bebida ${bebida.nombre} se eliminó correctamente.`
                    )
                },
                // muestra el mensaje de error si falla la eliminación
                onError: (error) => {
                    setAccion(null)
                    mostrarError(error)
                }
            })
        }
    }

    // verifica si existe alguna operación en proceso
    const accionPendiente =
        guardarBebida.isPending || eliminarBebida.isPending

    // genera el mensaje correspondiente a la acción que se desea confirmar
    const mensajeConfirmacion = () => {
        if (!accion) return ''

        const { tipo, bebida } = accion

        if (tipo === 'guardar') {
            return bebida
                ? `¿Deseas guardar los cambios realizados en la bebida ${bebida.nombre}?`
                : '¿Deseas registrar esta nueva bebida?'
        }

        if (tipo === 'eliminar') {
            return `¿Deseas eliminar la bebida ${bebida.nombre}? Esta acción no se puede deshacer.`
        }

        return ''
    }

    return (
        <>
            <section id="inicio" className="bebidas-page">
                {/* muestra la presentación principal a los usuarios no autenticados */}
                {!isAuthenticated && (
                    <section className="bebidas-page__hero">
                        <div className="bebidas-page__hero-contenido">
                            <h2>Café de especialidad, a tu medida</h2>
                            <p>
                                Explora recetas, gramajes y las bebidas de temporada.
                            </p>
                            <button
                                type="button"
                                className="bebidas-page__hero-boton"
                                onClick={() => {
                                    document.getElementById('catalogo-bebidas')?.scrollIntoView({
                                        behavior: 'smooth'
                                    })
                                }}
                            >
                                Explorar menú
                            </button>
                        </div>
                    </section>
                )}

                {/* catálogo y filtros de bebidas */}
                <div id="catalogo-bebidas" className="bebidas-page__catalogo">
                    <PageHeader
                        title="Bebidas"
                        buttonText="Nueva bebida"
                        buttonIcon={<Plus size={18} />}
                        showButton={puedeCrear}
                        onButtonClick={abrirModalCrear}
                        align="center"
                    >
                        Catálogo de bebidas de la cafetería.
                    </PageHeader>

                    {/* selector para filtrar las bebidas por categoría */}
                    <div className="bebidas-page__filtros">
                        <FilterSelect
                            label="Categoría"
                            name="categoria"
                            value={categoriaSeleccionada}
                            options={opcionesCategorias}
                            onChange={(valor) => {
                                if (valor) {
                                    setSearchParams({ categoria: valor })
                                } else {
                                    setSearchParams({})
                                }
                            }}
                            placeholder="Todas"
                        />
                    </div>

                    {/* muestra el estado de carga, error, catálogo vacío o las bebidas */}
                    {isLoading ? (
                        <p>Cargando bebidas...</p>
                    ) : isError ? (
                        <p>No se pudieron cargar las bebidas.</p>
                    ) : bebidasFiltradas.length === 0 ? (
                        <p className="bebidas-page__empty">
                            No hay bebidas registradas en esta categoría.
                        </p>
                    ) : (
                        // recorre las bebidas filtradas y muestra una tarjeta por cada una
                        <div className="bebidas-page__grid">
                            {bebidasFiltradas.map((bebida) => (
                                <CafeCard
                                    key={bebida.id}
                                    nombre={bebida.nombre}
                                    categoria={bebida.categoria?.nombre_categoria ?? 'Sin categoría'}
                                    descripcion={bebida.descripcion ?? ''}
                                    precio={bebida.precio}
                                    imagen={bebida.imagen_url}
                                    ingredientes={bebida.ingredientes ?? []}
                                    puedeEditar={puedeEditar}
                                    puedeEliminar={puedeEliminar}
                                    onEditar={() => abrirModalEditar(bebida)}
                                    onEliminar={() => abrirConfirmacionEliminar(bebida)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* modal para crear o editar una bebida */}
                <Modal
                    isOpen={modalAbierto}
                    onClose={cerrarModal}
                    title={bebidaSeleccionada ? 'Editar bebida' : 'Nueva bebida'}
                    description={
                        bebidaSeleccionada
                            ? 'Modifica la información de la bebida.'
                            : 'Completa los datos para registrar una nueva bebida.'
                    }
                    footer={
                        <>
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={cerrarModal}
                                disabled={guardarBebida.isPending}
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="submit"
                                form="form-bebida"
                                loading={guardarBebida.isPending}
                                disabled={guardarBebida.isPending}
                            >
                                Guardar
                            </Button>
                        </>
                    }
                >
                    <BebidaForm
                        bebida={bebidaSeleccionada}
                        onSubmit={enviarFormulario}
                        isPending={guardarBebida.isPending}
                    />
                </Modal>

                {/* diálogo para confirmar el registro, actualización o eliminación */}
                <ConfirmDialog
                    isOpen={!!accion}
                    onClose={cerrarConfirmacion}
                    onConfirm={confirmarAccion}
                    title={
                        accion?.tipo === 'guardar'
                            ? accion.bebida
                                ? 'Confirmar cambios'
                                : 'Registrar bebida'
                            : 'Eliminar bebida'
                    }
                    message={mensajeConfirmacion()}
                    confirmText={
                        accion?.tipo === 'guardar' ? 'Guardar' : 'Eliminar'
                    }
                    variant={
                        accion?.tipo === 'guardar' ? 'filled' : 'danger'
                    }
                    loading={accionPendiente}
                />

                {/* diálogo para mostrar el resultado de las operaciones */}
                <ResultDialog
                    isOpen={resultado.abierto}
                    onClose={() => setResultado(prev => ({ ...prev, abierto: false }))}
                    type={resultado.tipo}
                    title={resultado.titulo}
                    message={resultado.mensaje}
                />
            </section>

            {/* muestra las secciones de nosotros y el pie de página a usuarios no autenticados */}
            {!isAuthenticated && (
                <>
                    <div id="nosotros" className="bebidas-page__nosotros">
                        <NosotrosPage />
                    </div>

                    <Footer categorias={categorias} />
                </>
            )}
        </>
    )
}