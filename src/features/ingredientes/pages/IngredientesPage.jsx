import { useState } from 'react'
import { Plus } from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader/PageHeader'
import DataTable from '@/shared/components/DataTable/DataTable'
import './IngredientesPage.css'
import { useIngredientes } from '../hooks/useIngredientes'
import { usePermissions } from '@/features/auth/hooks/usePermissions'

export default function IngredientesPage() {
    // para obtener los ingredientes
    const { data: ingredientes = [], isLoading, isError } = useIngredientes()
    const { hasPermission } = usePermissions()

    // para controlar la paginacion
    const [pagina, setPagina] = useState(1)
    const [registrosPorPagina, setRegistrosPorPagina] = useState(10)

    // para ver si puede o no ver ciertos elementos
    const puedeCrear = hasPermission('ingredientes.crear')
    const puedeEditar = hasPermission('ingredientes.editar')
    const puedeEliminar = hasPermission('ingredientes.eliminar')

    // columnas que se mostraran en la tabla
    const columnas = [
        {
            key: 'nombre_ingrediente',
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
                showActions={puedeEditar || puedeEliminar}
            />
        </section>
    )
}