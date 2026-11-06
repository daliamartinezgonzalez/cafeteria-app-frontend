import { forwardRef, useId } from 'react'
import { ChevronDown } from 'lucide-react'
import './Select.css'

const Select = forwardRef(function Select({
    label,
    error,
    options = [],
    placeholder = 'Selecciona una opción',
    id,
    className = '',
    ...props
}, ref) {
    const generatedId = useId()
    const selectId = id || generatedId
    const errorId = `${selectId}-error`

    return (
        <div className={`select-field ${className}`}>
            {label && (
                <label className="select-field__label" htmlFor={selectId}>
                    {label}
                </label>
            )}

            <div className="select-field__control-wrapper">
                <select
                    ref={ref}
                    id={selectId}
                    className="select-field__control"
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                    {...props}
                >
                    <option value="">{placeholder}</option>

                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <ChevronDown
                    className="select-field__icon"
                    size={18}
                    aria-hidden="true"
                />
            </div>

            {error && (
                <span id={errorId} className="select-field__error">
                    {error}
                </span>
            )}
        </div>
    )
})

export default Select
