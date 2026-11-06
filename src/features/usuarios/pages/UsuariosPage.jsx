import { useState } from 'react'
import { Plus } from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader/PageHeader'
import DataTable from '@/shared/components/DataTable/DataTable'
import Modal from '@/shared/components/Modal/Modal'
import Button from '@/shared/components/Button/Button'
import ConfirmDialog from '@/shared/components/ConfirmDialog/ConfirmDialog'
import ResultDialog from '@/shared/components/ResultDialog/ResultDialog'
import './UsuariosPage.css'
import UsuarioForm from '../components/UsuarioForm'
import { useUsuarios, useGuardarUsuario, useDeleteUsuario, usePatchUsuario } from '../hooks/useUsuarios'
import { usePermissions } from '@/features/auth/hooks/usePermissions'
import { getApiError } from '@/shared/utils/api-error'

export default function UsuariosPage() {
    const { data: usuarios = [], isLoading, isError } = useUsuarios()
    const guardarUsuario = useGuardarUsuario()
    const eliminarMutation = useDeleteUsuario()
    const cambiarEstadoMutation = usePatchUsuario()
    const { hasPermission } = usePermissions()
    const [pagina, setPagina] = useState(1)
    const [registrosPorPagina, setRegistrosPorPagina] = useState(10)
    const [modalAbierto, setModalAbierto] = useState(false)
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
    const [accion, setAccion] = useState(null)
    const [datosPendientes, setDatosPendientes] = useState(null)
    const [resultado, setResultado] = useState({
        abierto: false,
        tipo: 'success',
        titulo: '',
        mensaje: ''
    })

    const puedeCrear = hasPermission('usuarios.crear')
    const puedeEditar = hasPermission('usuarios.editar')
    const puedeEliminar = hasPermission('usuarios.eliminar')

    const columnas = [
        {
            key: 'nombre',
            header: 'Nombre',
            render: (usuario) =>
                `${usuario.nombre} ${usuario.apellido_p} ${usuario.apellido_m ?? ''}`.trim()
        },
        {
            key: 'email',
            header: 'Correo electrónico'
        },
        {
            key: 'rol.nombre',
            header: 'Rol'
        },
        {
            key: 'activo',
            header: 'Estado',
            render: (usuario) => (
                <span className={`estado ${usuario.activo ? 'estado--activo' : 'estado--inactivo'}`}>
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                </span>
            )
        }
    ]

    const total = usuarios.length
    const totalPaginas = Math.ceil(total / registrosPorPagina)

    const usuariosPaginados = usuarios.slice(
        (pagina - 1) * registrosPorPagina,
        pagina * registrosPorPagina
    )

    const cambiarRegistros = (cantidad) => {
        setRegistrosPorPagina(cantidad)
        setPagina(1)
    }

    const abrirModalCrear = () => {
        setUsuarioSeleccionado(null)
        setModalAbierto(true)
    }

    const abrirModalEditar = (usuario) => {
        setUsuarioSeleccionado(usuario)
        setModalAbierto(true)
    }

    const cerrarModal = () => {
        if (guardarUsuario.isPending) return

        setModalAbierto(false)
        setUsuarioSeleccionado(null)
        setDatosPendientes(null)
        guardarUsuario.reset()
    }

    const mostrarResultado = (tipo, titulo, mensaje) => {
        setResultado({
            abierto: true,
            tipo,
            titulo,
            mensaje
        })
    }

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
            usuario: usuarioSeleccionado
        })
    }

    const solicitarEliminacion = (usuario) => {
        setAccion({
            tipo: 'eliminar',
            usuario
        })
    }

    const solicitarCambioEstado = (usuario) => {
        setAccion({
            tipo: 'estado',
            usuario
        })
    }

    const cerrarConfirmacion = () => {
        if (
            guardarUsuario.isPending ||
            eliminarMutation.isPending ||
            cambiarEstadoMutation.isPending
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

        const { tipo, usuario } = accion

        if (tipo === 'guardar') {
            guardarUsuario.mutate(
                {
                    id: usuario?.id,
                    datos: datosPendientes
                },
                {
                    onSuccess: () => {
                        setAccion(null)
                        setDatosPendientes(null)
                        setModalAbierto(false)
                        setUsuarioSeleccionado(null)
                        guardarUsuario.reset()

                        mostrarResultado(
                            'success',
                            usuario ? 'Usuario actualizado' : 'Usuario creado',
                            usuario
                                ? 'Los datos del usuario se actualizaron correctamente.'
                                : 'El usuario se registró correctamente.'
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

        if (tipo === 'eliminar') {
            eliminarMutation.mutate(usuario.id, {
                onSuccess: () => {
                    setAccion(null)

                    mostrarResultado(
                        'success',
                        'Usuario eliminado',
                        `El usuario ${usuario.nombre} se eliminó correctamente.`
                    )
                },
                onError: (error) => {
                    setAccion(null)
                    mostrarError(error)
                }
            })

            return
        }

        const nuevoEstado = !usuario.activo

        cambiarEstadoMutation.mutate(
            {
                id: usuario.id,
                datos: { activo: nuevoEstado }
            },
            {
                onSuccess: () => {
                    setAccion(null)

                    mostrarResultado(
                        'success',
                        nuevoEstado ? 'Usuario activado' : 'Usuario desactivado',
                        `El usuario ${usuario.nombre} ahora está ${nuevoEstado ? 'activo' : 'inactivo'}.`
                    )
                },
                onError: (error) => {
                    setAccion(null)
                    mostrarError(error)
                }
            }
        )
    }

    const accionPendiente =
        guardarUsuario.isPending ||
        eliminarMutation.isPending ||
        cambiarEstadoMutation.isPending

    const mensajeConfirmacion = () => {
        if (!accion) return ''

        const { tipo, usuario } = accion

        if (tipo === 'guardar') {
            return usuario
                ? `¿Deseas guardar los cambios realizados en el usuario ${usuario.nombre}?`
                : '¿Deseas registrar este nuevo usuario?'
        }

        if (tipo === 'eliminar') {
            return `¿Estás seguro de que deseas eliminar a ${usuario.nombre}? Esta acción no se puede deshacer.`
        }

        return `¿Deseas ${usuario.activo ? 'desactivar' : 'activar'} al usuario ${usuario.nombre}?`
    }

    if (isLoading) {
        return <p>Cargando usuarios...</p>
    }

    if (isError) {
        return <p>No se pudieron cargar los usuarios.</p>
    }

    return (
        <section className="usuarios-page">
            <PageHeader
                title="Usuarios"
                buttonText="Nuevo usuario"
                buttonIcon={<Plus size={18} />}
                showButton={puedeCrear}
                onButtonClick={abrirModalCrear}
            >
                Administración de usuarios del sistema.
            </PageHeader>


            <DataTable
                data={usuariosPaginados}
                columns={columnas}
                getRowKey={(usuario) => usuario.id}
                emptyMessage="No hay usuarios registrados."
                total={total}
                from={total === 0 ? 0 : (pagina - 1) * registrosPorPagina + 1}
                to={Math.min(pagina * registrosPorPagina, total)}
                pageSize={registrosPorPagina}
                onPageSizeChange={cambiarRegistros}
                currentPage={pagina}
                totalPages={Math.max(totalPaginas, 1)}
                onPageChange={setPagina}
                onEdit={puedeEditar ? abrirModalEditar : undefined}
                onToggleStatus={puedeEditar ? solicitarCambioEstado : undefined}
                onDelete={puedeEliminar ? solicitarEliminacion : undefined}
                showActions={puedeEditar || puedeEliminar}
            />

            <Modal
                isOpen={modalAbierto}
                onClose={cerrarModal}
                title={usuarioSeleccionado ? 'Editar usuario' : 'Nuevo usuario'}
                description={
                    usuarioSeleccionado
                        ? 'Modifica la información del usuario.'
                        : 'Completa los datos para registrar un nuevo usuario.'
                }
                footer={
                    <>
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={cerrarModal}
                            disabled={guardarUsuario.isPending}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            form="form-usuario"
                            loading={guardarUsuario.isPending}
                            disabled={guardarUsuario.isPending}
                        >
                            Guardar
                        </Button>
                    </>
                }
            >
                <UsuarioForm
                    usuario={usuarioSeleccionado}
                    onSubmit={enviarFormulario}
                    isPending={guardarUsuario.isPending}
                />
            </Modal>

            <ConfirmDialog
                isOpen={!!accion}
                onClose={cerrarConfirmacion}
                onConfirm={confirmarAccion}
                title={
                    accion?.tipo === 'guardar'
                        ? accion.usuario
                            ? 'Confirmar cambios'
                            : 'Registrar usuario'
                        : accion?.tipo === 'eliminar'
                            ? 'Eliminar usuario'
                            : accion?.usuario?.activo
                                ? 'Desactivar usuario'
                                : 'Activar usuario'
                }
                message={mensajeConfirmacion()}
                confirmText={
                    accion?.tipo === 'guardar'
                        ? 'Guardar'
                        : accion?.tipo === 'eliminar'
                            ? 'Eliminar'
                            : accion?.usuario?.activo
                                ? 'Desactivar'
                                : 'Activar'
                }
                variant={
                    accion?.tipo === 'guardar'
                        ? 'filled'
                        : accion?.tipo === 'eliminar' || accion?.usuario?.activo
                            ? 'danger'
                            : 'warning'
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