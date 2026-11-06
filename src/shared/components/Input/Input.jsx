import { forwardRef, useId } from 'react'
import './Input.css'

const Input = forwardRef(function Input({
    label,
    error,
    id,
    className = '',
    ...props
}, ref) {
    const generatedId = useId()
    const inputId = id || generatedId
    const errorId = `${inputId}-error`

    return (
        <div className={`input-field ${className}`}>
            {label && (
                <label className="input-field__label" htmlFor={inputId}>
                    {label}
                </label>
            )}

            <input
                ref={ref}
                id={inputId}
                className="input-field__control"
                aria-invalid={!!error}
                aria-describedby={error ? errorId : undefined}
                {...props}
            />

            {error && (
                <span id={errorId} className="input-field__error">
                    {error}
                </span>
            )}
        </div>
    )
})

export default Input
