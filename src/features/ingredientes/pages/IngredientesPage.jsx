import { useState } from 'react'
import { Plus } from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader/PageHeader'
import DataTable from '@/shared/components/DataTable/DataTable'
import './IngredientesPage.css'
import { useIngredientes, useGuardarIngrediente } from '../hooks/useIngredientes'
import IngredienteForm from '../components/IngredienteForm'
import { usePermissions } from '@/features/auth/hooks/usePermissions'
import { getApiError } from '@/shared/utils/api-error'
import Modal from '@/shared/components/Modal/Modal'
import Button from '@/shared/components/Button/Button'
import ConfirmDialog from '@/shared/components/ConfirmDialog/ConfirmDialog'
import ResultDialog from '@/shared/components/ResultDialog/ResultDialog'

export default function IngredientesPage() {
    // para obtener los ingredientes
    const { data: ingredientes = [], isLoading, isError } = useIngredientes()
    const guardarIngrediente = useGuardarIngrediente()
    const { hasPermission } = usePermissions()

    // para controlar la paginacion
    const [pagina, setPagina] = useState(1)
    const [registrosPorPagina, setRegistrosPorPagina] = useState(10)

    // para los modales
    const [modalAbierto, setModalAbierto] = useState(false)
    const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState(null)
    const [accion, setAccion] = useState(null)
    const [datosPendientes, setDatosPendientes] = useState(null)
    const [resultado, setResultado] = useState({
        abierto: false,
        tipo: 'success',
        titulo: '',
        mensaje: ''
    })

    // para ver si puede o no ver ciertos elementos
    const puedeCrear = hasPermission('ingredientes.crear')
    const puedeEditar = hasPermission('ingredientes.editar')
    const puedeEliminar = hasPermission('ingredientes.eliminar')

    // columnas que se mostraran en la tabla
    const columnas = [
        {
            key: 'nombre',
            header: 'Nombre'
        }
    ]

    // para calcular el total de registros y paginas
    const total = ingredientes.length
    const totalPaginas = Math.ceil(total / registrosPorPagina)

    // para mostrar los ingredientes correspondientes a la pagina actual
    const ingredientesPaginados = ingredientes.slice(
        (pagina - 1) * registrosPorPagina,
        pagina * registrosPorPagina
    )

    // para cambiar la cantidad de registros por pagina
    const cambiarRegistros = (cantidad) => {
        setRegistrosPorPagina(cantidad)
        setPagina(1)
    }

    // para abrir el modal de crear
    const abrirModalCrear = () => {
        setIngredienteSeleccionado(null)
        setModalAbierto(true)
    }

    // para abrir el modal de editar
    const abrirModalEditar = (ingrediente) => {
        setIngredienteSeleccionado(ingrediente)
        setModalAbierto(true)
    }

    // para cerrar el modal
    const cerrarModal = () => {
        if (guardarIngrediente.isPending) return
        setModalAbierto(false)
        setIngredienteSeleccionado(null)
        setDatosPendientes(null)
        guardarIngrediente.reset()
    }

    // para el modal de resultado
    const mostrarResultado = (tipo, titulo, mensaje) => {
        setResultado({
            abierto: true,
            tipo,
            titulo,
            mensaje
        })
    }

    // para mostrar el error del back en caso de que no se pueda guardar
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

    const enviarFormulario = (datos) => {
        setDatosPendientes(datos)
        setAccion({
            tipo: 'guardar',
            ingrediente: ingredienteSeleccionado
        })
    }

    const cerrarConfirmacion = () => {
        if (guardarIngrediente.isPending) {
            return
        }

        setAccion(null)

        if (accion?.tipo === 'guardar') {
            setDatosPendientes(null)
        }
    }

    const confirmarAccion = () => {
        if (!accion) return

        const { tipo, ingrediente } = accion

        if (tipo === 'guardar') {
            guardarIngrediente.mutate(
                {
                    id: ingrediente?.id,
                    datos: datosPendientes
                },
                {
                    onSuccess: () => {
                        setAccion(null)
                        setDatosPendientes(null)
                        setModalAbierto(false)
                        setIngredienteSeleccionado(null)
                        guardarIngrediente.reset()

                        mostrarResultado(
                            'success',
                            ingrediente ? 'Ingrediente actualizado' : 'Ingrediente creado',
                            ingrediente
                                ? 'Los datos del ingrediente se actualizaron correctamente.'
                                : 'El ingrediente se registró correctamente.'
                        )
                    },
                    onError: (error) => {
                        setAccion(null)
                        setDatosPendientes(null)
                        mostrarError(error)
                    }
                }
            )

            return
        }
    }

    const accionPendiente = guardarIngrediente.isPending

    // para saber que mensaje de confirmacion mandar segun el caso
    const mensajeConfirmacion = () => {
        if (!accion) return ''

        const { tipo, ingrediente } = accion

        if (tipo === 'guardar') {
            return ingrediente
                ? `¿Deseas guardar los cambios realizados en el ingrediente ${ingrediente.nombre}?`
                : '¿Deseas registrar este nuevo ingrediente?'
        }
    }

    // para mostrar el estado de carga
    if (isLoading) {
        return <p>Cargando ingredientes...</p>
    }

    // para mostrar un mensaje si ocurre un error
    if (isError) {
        return <p>No se pudieron cargar los ingredientes.</p>
    }

    return (
        <section className="ingredientes-page">
            {/* encabezado de la pagina */}
            <PageHeader
                title="Ingredientes"
                buttonText="Nuevo ingrediente"
                buttonIcon={<Plus size={18} />}
                showButton={puedeCrear}
                onButtonClick={abrirModalCrear}
            >
                Administración de ingredientes del sistema.
            </PageHeader>

            {/* tabla de ingredientes */}
            <DataTable
                data={ingredientesPaginados}
                columns={columnas}
                getRowKey={(ingrediente) => ingrediente.id}
                emptyMessage="No hay ingredientes registrados."
                total={total}
                from={total === 0 ? 0 : (pagina - 1) * registrosPorPagina + 1}
                to={Math.min(pagina * registrosPorPagina, total)}
                pageSize={registrosPorPagina}
                onPageSizeChange={cambiarRegistros}
                currentPage={pagina}
                totalPages={Math.max(totalPaginas, 1)}
                onPageChange={setPagina}
                onEdit={puedeEditar ? abrirModalEditar : undefined}
                showActions={puedeEditar || puedeEliminar}
            />

            {/* modal para crear y editar ingredientes */}
            <Modal
                isOpen={modalAbierto}
                onClose={cerrarModal}
                title={ingredienteSeleccionado ? 'Editar ingrediente' : 'Nuevo ingrediente'}
                description={
                    ingredienteSeleccionado
                        ? 'Modifica la información del ingrediente.'
                        : 'Completa los datos para registrar un nuevo ingrediente.'
                }
                footer={
                    <>
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={cerrarModal}
                            disabled={guardarIngrediente.isPending}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            form="form-ingrediente"
                            loading={guardarIngrediente.isPending}
                            disabled={guardarIngrediente.isPending}
                        >
                            Guardar
                        </Button>
                    </>
                }
            >
                <IngredienteForm
                    ingrediente={ingredienteSeleccionado}
                    onSubmit={enviarFormulario}
                    isPending={guardarIngrediente.isPending}
                />
            </Modal>

            {/* modal de confirmacion */}
            <ConfirmDialog
                isOpen={!!accion}
                onClose={cerrarConfirmacion}
                onConfirm={confirmarAccion}
                title={
                    accion?.ingrediente
                        ? 'Confirmar cambios'
                        : 'Registrar ingrediente'
                }
                message={mensajeConfirmacion()}
                confirmText="Guardar"
                variant="filled"
                loading={accionPendiente}
            />

            {/* modal de resultado */}
            <ResultDialog
                isOpen={resultado.abierto}
                onClose={() => setResultado(prev => ({ ...prev, abierto: false }))}
                type={resultado.tipo}
                title={resultado.titulo}
                message={resultado.mensaje}
            />
        </section>
    )
}