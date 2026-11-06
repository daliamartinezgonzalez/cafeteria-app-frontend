import {
    Copy,
    CreditCard,
    Download,
    Eye,
    HandCoins,
    Pencil,
    Printer,
    Trash2,
    UserRoundCheck,
    UserRoundX
} from 'lucide-react'
import './DataTable.css'

export default function DataTable({
    data,
    columns,
    getRowKey,
    onView,
    onSell,
    onDownload,
    onPago,
    onToggleStatus,
    onEdit,
    onDuplicate,
    onPrintTicket,
    onDelete,
    emptyMessage = 'No hay registros disponibles.',
    showActions = true,
    total,
    from,
    to,
    pageSize = 20,
    pageSizeOptions = [5, 10, 20, 30, 50],
    onPageSizeChange,
    currentPage = 1,
    totalPages = 1,
    onPageChange
}) {
    const totalRecords = total ?? data.length
    const firstShown = from ?? (totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1)
    const lastShown = to ?? Math.min(currentPage * pageSize, totalRecords)

    const getActions = (item) => [
        { key: 'view', title: 'Ver', icon: Eye, handler: onView },
        {
            key: 'sell',
            title: 'Vender',
            icon: HandCoins,
            handler: onSell,
            visible: item.estado === 'Disponible'
        },
        { key: 'download', title: 'Descargar', icon: Download, handler: onDownload },
        { key: 'pago', title: 'Registrar pago', icon: CreditCard, handler: onPago },
        {
            key: 'toggle',
            title: item.activo ? 'Desactivar usuario' : 'Activar usuario',
            icon: item.activo ? UserRoundX : UserRoundCheck,
            handler: onToggleStatus
        },
        { key: 'edit', title: 'Editar', icon: Pencil, handler: onEdit },
        { key: 'duplicate', title: 'Duplicar', icon: Copy, handler: onDuplicate },
        { key: 'print', title: 'Imprimir ticket', icon: Printer, handler: onPrintTicket },
        { key: 'delete', title: 'Eliminar', icon: Trash2, handler: onDelete, danger: true }
    ].filter((action) => action.handler && action.visible !== false)

    const pageItems = getPaginationItems(currentPage, totalPages)

    return (
        <div className="data-table">
            <div className="data-table__scroll">
                <table className="data-table__table">
                    <thead className="data-table__head">
                        <tr className="data-table__head-row">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    scope="col"
                                    className={`data-table__head-cell ${column.className ?? ''}`}
                                >
                                    {column.header}
                                </th>
                            ))}

                            {showActions && (
                                <th
                                    scope="col"
                                    className="data-table__head-cell data-table__head-cell--actions"
                                >
                                    ACCIONES
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="data-table__body">
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={getRowKey(item)} className="data-table__row">
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            data-label={column.header}
                                            className={`data-table__cell ${column.className ?? ''}`}
                                        >
                                            {column.render
                                                ? column.render(item)
                                                : getValue(item, column.key)}
                                        </td>
                                    ))}

                                    {showActions && (
                                        <td
                                            data-label="Acciones"
                                            className="data-table__cell data-table__cell--actions"
                                        >
                                            <div className="data-table__actions">
                                                {getActions(item).map(({ key, title, icon: Icon, handler, danger }) => (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        title={title}
                                                        aria-label={title}
                                                        onClick={() => handler(item)}
                                                        className={`data-table__action${danger ? ' data-table__action--danger' : ''}`}
                                                    >
                                                        <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr className="data-table__row data-table__row--empty">
                                <td
                                    colSpan={columns.length + (showActions ? 1 : 0)}
                                    className="data-table__empty"
                                    role="status"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {data.length > 0 && (
                <div className="data-table__footer">
                    <p className="data-table__summary">
                        Mostrando {firstShown} a {lastShown} de {totalRecords} registros
                    </p>

                    {onPageSizeChange && (
                        <label className="data-table__page-size">
                            <span className="data-table__page-size-label">Mostrar</span>
                            <select
                                value={pageSize}
                                onChange={(event) => onPageSizeChange(Number(event.target.value))}
                                className="data-table__select"
                            >
                                {pageSizeOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}

                    <nav className="data-table__pager" aria-label="Paginación de la tabla">
                        <button
                            type="button"
                            disabled={currentPage <= 1}
                            onClick={() => onPageChange?.(currentPage - 1)}
                            className="data-table__pager-button"
                        >
                            Anterior
                        </button>

                        <div className="data-table__pages">
                            {pageItems.map((pageItem, index) =>
                                pageItem === '...' ? (
                                    <span key={`ellipsis-${index}`} className="data-table__ellipsis">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={pageItem}
                                        type="button"
                                        onClick={() => onPageChange?.(pageItem)}
                                        aria-current={currentPage === pageItem ? 'page' : undefined}
                                        aria-label={`Página ${pageItem}`}
                                        className={`data-table__page${currentPage === pageItem ? ' data-table__page--active' : ''}`}
                                    >
                                        {pageItem}
                                    </button>
                                )
                            )}
                        </div>

                        <button
                            type="button"
                            disabled={currentPage >= totalPages}
                            onClick={() => onPageChange?.(currentPage + 1)}
                            className="data-table__pager-button"
                        >
                            Siguiente
                        </button>
                    </nav>
                </div>
            )}
        </div>
    )
}

// Números de página visibles: 1 ... 4 5 6 ... 10
function getPaginationItems(currentPage, totalPages) {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    if (currentPage <= 4) {
        return [1, 2, 3, 4, 5, '...', totalPages]
    }

    if (currentPage >= totalPages - 3) {
        return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
}

// Lee valores anidados con rutas como "categoria.nombre"
function getValue(item, key) {
    return key.split('.').reduce((value, property) => {
        if (value !== null && typeof value === 'object') {
            return value[property]
        }
        return undefined
    }, item)
}