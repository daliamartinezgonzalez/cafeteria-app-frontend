import { useState } from 'react'
import { Plus } from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader/PageHeader'
import DataTable from '@/shared/components/DataTable/DataTable'
import './CategoriasPage.css'
import { useCategorias, useGuardarCategoria } from '../hooks/useCategorias'
import CategoriaForm from '../components/CategoriaForm'
import { usePermissions } from '@/features/auth/hooks/usePermissions'
import { getApiError } from '@/shared/utils/api-error'
import Modal from '@/shared/components/Modal/Modal'
import Button from '@/shared/components/Button/Button'
import ConfirmDialog from '@/shared/components/ConfirmDialog/ConfirmDialog'
import ResultDialog from '@/shared/components/ResultDialog/ResultDialog'


export default function CategoriasPage() {
    // para obtener las categorias
    const { data: categorias = [], isLoading, isError } = useCategorias()
    const guardarCategoria = useGuardarCategoria()
    const { hasPermission } = usePermissions()
    // para controlar la paginacion
    const [pagina, setPagina] = useState(1)
    const [registrosPorPagina, setRegistrosPorPagina] = useState(10)
    // para los modales
    const [modalAbierto, setModalAbierto] = useState(false)
    const [categoriaSeleccionado, setCategoriaSeleccionado] = useState(null)
    const [accion, setAccion] = useState(null)
    const [datosPendientes, setDatosPendientes] = useState(null)
    const [resultado, setResultado] = useState({
        abierto: false,
        tipo: 'success',
        titulo: '',
        mensaje: ''
    })
    // para ver si puede o no ver ciertos elementos
    const puedeCrear = hasPermission('categorias.crear')
    const puedeEditar = hasPermission('categorias.editar')
    const puedeEliminar = hasPermission('categorias.eliminar')

    // columnas que se mostraran en la tabla
    const columnas = [
        {
            key: 'nombre_categoria',
            header: 'Nombre'
        }
    ]
    // para calcular el total de registros y paginas
    const total = categorias.length
    const totalPaginas = Math.ceil(total / registrosPorPagina)
    // para mostrar las categorias correspondientes a la pagina actual
    const categoriasPaginadas = categorias.slice(
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
        setCategoriaSeleccionado(null)
        setModalAbierto(true)
    }
    // para abrir el modal de editar
    const abrirModalEditar = (categoria) => {
        setCategoriaSeleccionado(categoria)
        setModalAbierto(true)
    }
    // para cerrer el modal
    const cerrarModal = () => {
        if (guardarCategoria.isPending) return
        setModalAbierto(false)
        setCategoriaSeleccionado(null)
        setDatosPendientes(null)
        guardarCategoria.reset()
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
            categoria: categoriaSeleccionado
        })
    }

    const cerrarConfirmacion = () => {
        if (
            guardarCategoria.isPending
        ) {
            return
        }

        setAccion(null)

        if (accion?.tipo === 'guardar') {
            setDatosPendientes(null)
        }
    }

    const confirmarAccion = () => {
        if (!accion) return

        const { tipo, categoria } = accion

        if (tipo === 'guardar') {
            guardarCategoria.mutate(
                {
                    id: categoria?.id,
                    datos: datosPendientes
                },
                {
                    onSuccess: () => {
                        setAccion(null)
                        setDatosPendientes(null)
                        setModalAbierto(false)
                        setCategoriaSeleccionado(null)
                        guardarCategoria.reset()

                        mostrarResultado(
                            'success',
                            categoria ? 'Categoria actualizada' : 'Categoria creada',
                            categoria
                                ? 'Los datos de la categoria se actualizaron correctamente.'
                                : 'La categoria se registró correctamente.'
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

    const accionPendiente =
        guardarCategoria.isPending
    // para saber que mensaje de connfirmacion mandar segun el caso
    const mensajeConfirmacion = () => {
        if (!accion) return ''

        const { tipo, categoria } = accion

        if (tipo === 'guardar') {
            return categoria
                ? `¿Deseas guardar los cambios realizados en la categoria ${categoria.nombre_categoria}?`
                : '¿Deseas registrar esta nueva categoria?'
        }

    }
    // para mostrar el estado de carga
    if (isLoading) {
        return <p>Cargando categorias...</p>
    }
    // para mostrar un mensaje si ocurre un error
    if (isError) {
        return <p>No se pudieron cargar las categorias.</p>
    }
    return (
        <section className="categorias-page">
            {/* encabezado de la pagina */}
            <PageHeader
                title="Categorias"
                buttonText="Nueva categoria"
                buttonIcon={<Plus size={18} />}
                showButton={puedeCrear}
                onButtonClick={abrirModalCrear}
            >
                Administración de categorias del sistema.
            </PageHeader>

            {/* tabla de categorias */}
            <DataTable
                data={categoriasPaginadas}
                columns={columnas}
                getRowKey={(categoria) => categoria.id}
                emptyMessage="No hay categorias registradas."
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
            <Modal
                isOpen={modalAbierto}
                onClose={cerrarModal}
                title={categoriaSeleccionado ? 'Editar categoria' : 'Nueva categoria'}
                description={
                    categoriaSeleccionado
                        ? 'Modifica la información de la categoria.'
                        : 'Completa los datos para registrar una nueva categoria.'
                }
                footer={
                    <>
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={cerrarModal}
                            disabled={guardarCategoria.isPending}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            form="form-categoria"
                            loading={guardarCategoria.isPending}
                            disabled={guardarCategoria.isPending}
                        >
                            Guardar
                        </Button>
                    </>
                }
            >
                <CategoriaForm
                    categoria={categoriaSeleccionado}
                    onSubmit={enviarFormulario}
                    isPending={guardarCategoria.isPending}
                />
            </Modal>

            <ConfirmDialog
                isOpen={!!accion}
                onClose={cerrarConfirmacion}
                onConfirm={confirmarAccion}
                title={
                    accion?.tipo === 'guardar'
                        ? accion.categoria
                            ? 'Confirmar cambios'
                            : 'Registrar categoria'
                        : 'Eliminar categoria'
                }
                message={mensajeConfirmacion()}
                confirmText={
    accion?.tipo === 'guardar'
        ? 'Guardar'
        : 'Eliminar'
}
                variant={
    accion?.tipo === 'guardar'
        ? 'filled'
        : 'danger'
}
                loading={accionPendiente}
            />

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
