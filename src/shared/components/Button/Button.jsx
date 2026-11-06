import { forwardRef } from 'react'
import './Button.css'

const Button = forwardRef(function Button({
    children,
    variant = 'filled',
    size = 'medium',
    icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    type = 'button',
    className = '',
    ...props
}, ref) {
    return (
        <button
            ref={ref}
            type={type}
            className={`button button--${variant} button--${size} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="button__spinner" aria-hidden="true" />
            ) : (
                icon && iconPosition === 'left' && (
                    <span className="button__icon">{icon}</span>
                )
            )}

            <span className="button__label">
                {loading ? 'Cargando...' : children}
            </span>

            {!loading && icon && iconPosition === 'right' && (
                <span className="button__icon">{icon}</span>
            )}
        </button>
    )
})

export default Button
