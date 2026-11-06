import { useEffect } from 'react'
import { X } from 'lucide-react'
import './Modal.css'

export default function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'medium'
}) {
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose()
        }

        document.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose()
        }
    }

    return (
        <div
            className="modal__backdrop"
            onMouseDown={handleBackdropClick}
        >
            <section
                className={`modal modal--${size}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                aria-describedby={description ? 'modal-description' : undefined}
            >
                <header className="modal__header">
                    <div className="modal__heading">
                        <h2 id="modal-title" className="modal__title">
                            {title}
                        </h2>
                        {description && (
                            <p id="modal-description" className="modal__description">
                                {description}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        className="modal__close"
                        onClick={onClose}
                        aria-label="Cerrar modal"
                    >
                        <X size={20} />
                    </button>
                </header>

                <div className="modal__content">
                    {children}
                </div>

                {footer && (
                    <footer className="modal__footer">
                        {footer}
                    </footer>
                )}
            </section>
        </div>
    )
}