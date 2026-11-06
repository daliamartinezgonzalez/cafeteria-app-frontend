import { AlertTriangle } from 'lucide-react'
import Modal from '@/shared/components/Modal/Modal'
import Button from '@/shared/components/Button/Button'
import './ConfirmDialog.css'

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = '¿Estás seguro?',
    message = 'Esta acción no se puede deshacer.',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger',
    loading = false
}) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="small"
        >
            <div className="confirm-dialog">
                <div className={`confirm-dialog__icon confirm-dialog__icon--${variant}`}>
                    <AlertTriangle size={26} />
                </div>

                <p className="confirm-dialog__message">
                    {message}
                </p>

                <div className="confirm-dialog__actions">
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>

                    <Button
                        variant={variant}
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}