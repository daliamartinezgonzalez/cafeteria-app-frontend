import './Pagination.css'

export default function Pagination({
    totalRegistros,
    from,
    to,
    paginaActual,
    totalPaginas,
    pageSize,
    pageSizeOptions = [5, 10, 20, 30, 50],
    onPageChange,
    onPageSizeChange
}) {
    if (totalRegistros === 0) return null

    const desde = from ?? (paginaActual - 1) * pageSize + 1
    const hasta = to ?? Math.min(paginaActual * pageSize, totalRegistros)
    const paginasVisibles = getPaginasVisibles(paginaActual, totalPaginas)

    return (
        <div className="pagination">
            <p className="pagination__summary">
                Mostrando {desde} a {hasta} de {totalRegistros} registros
            </p>

            {onPageSizeChange && (
                <label className="pagination__page-size">
                    <span className="pagination__page-size-label">Mostrar</span>
                    <select
                        value={pageSize}
                        onChange={(event) => onPageSizeChange(Number(event.target.value))}
                        className="pagination__select"
                    >
                        {pageSizeOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </label>
            )}

            {totalPaginas > 1 && (
                <nav className="pagination__controls" aria-label="Paginación">
                    <button
                        type="button"
                        disabled={paginaActual <= 1}
                        onClick={() => onPageChange(Math.max(paginaActual - 1, 1))}
                        className="pagination__button"
                    >
                        Anterior
                    </button>

                    <div className="pagination__pages">
                        {paginasVisibles.map((pagina, index) =>
                            pagina === '...' ? (
                                <span key={`ellipsis-${index}`} className="pagination__ellipsis">
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={pagina}
                                    type="button"
                                    onClick={() => onPageChange(pagina)}
                                    aria-current={paginaActual === pagina ? 'page' : undefined}
                                    aria-label={`Página ${pagina}`}
                                    className={`pagination__page${paginaActual === pagina ? ' pagination__page--active' : ''}`}
                                >
                                    {pagina}
                                </button>
                            )
                        )}
                    </div>

                    <button
                        type="button"
                        disabled={paginaActual >= totalPaginas}
                        onClick={() => onPageChange(Math.min(paginaActual + 1, totalPaginas))}
                        className="pagination__button"
                    >
                        Siguiente
                    </button>
                </nav>
            )}
        </div>
    )
}

// Números de página visibles: 
function getPaginasVisibles(paginaActual, totalPaginas) {
    if (totalPaginas <= 7) {
        return Array.from({ length: totalPaginas }, (_, index) => index + 1)
    }

    // Al inicio
    if (paginaActual <= 4) {
        return [1, 2, 3, 4, 5, '...', totalPaginas]
    }

    // Al final
    if (paginaActual >= totalPaginas - 3) {
        return [1, '...', totalPaginas - 4, totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas]
    }

    // En medio
    return [1, '...', paginaActual - 1, paginaActual, paginaActual + 1, '...', totalPaginas]
}