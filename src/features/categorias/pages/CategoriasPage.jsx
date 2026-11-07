import { useState } from 'react'
import { Plus } from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader/PageHeader'
import DataTable from '@/shared/components/DataTable/DataTable'
import './CategoriasPage.css'
import { useCategorias } from '../hooks/useCategorias'

export default function CategoriasPage() {
    // para obtener las categorias
    const { data: categorias = [], isLoading, isError } = useCategorias()
    // para controlar la paginacion
    const [pagina, setPagina] = useState(1)
    const [registrosPorPagina, setRegistrosPorPagina] = useState(10)
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
                showButton={true}
                onButtonClick={() => {}}
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
                onEdit={() => {}}
                onDelete={() => {}}
                showActions={true}
            />
        </section>
    )
}