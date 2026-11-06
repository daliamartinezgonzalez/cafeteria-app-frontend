import { CheckCircle2, XCircle } from 'lucide-react'
import Modal from '@/shared/components/Modal/Modal'
import Button from '@/shared/components/Button/Button'
import './ResultDialog.css'

export default function ResultDialog({
    isOpen,
    onClose,
    type = 'success',
    title,
    message,
    buttonText = 'Aceptar'
}) {
    const esExito = type === 'success'

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title || (esExito ? 'Operación exitosa' : 'Ocurrió un error')}
            size="small"
        >
            <div className="result-dialog">
                <div className={`result-dialog__icon result-dialog__icon--${type}`}>
                    {esExito
                        ? <CheckCircle2 size={32} />
                        : <XCircle size={32} />
                    }
                </div>

                <p className="result-dialog__message">
                    {message}
                </p>

                <div className="result-dialog__actions">
                    <Button variant="filled" onClick={onClose}>
                        {buttonText}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}