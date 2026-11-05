import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Eye, EyeOff, Loader2, LockKeyhole, LogIn, Mail } from 'lucide-react'
import { getApiError } from '@/shared/utils/api-error'
import { loginSchema } from '../schemas/login.schema'
import { useLogin } from '../hooks/useLogin'
import './LoginForm.css'

export default function LoginForm() {
    const loginMutation = useLogin()
    const [mostrarPassword, setMostrarPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema)
    })

    const errorLogin = loginMutation.isError
        ? getApiError(loginMutation.error)
        : {}

    const onSubmit = (data) => {
        loginMutation.mutate(data)
    }

    const containerClass = (hasError) =>
        `login-form__input-container${hasError ? ' login-form__input-container--error' : ''}`

    return (
        <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="login-form__field">
                <label className="login-form__label" htmlFor="email">
                    Correo electrónico
                </label>

                <div className={containerClass(errors.email)}>
                    <Mail className="login-form__icon" size={20} aria-hidden="true" />

                    <input
                        id="email"
                        type="email"
                        placeholder="nombre@correo.com"
                        autoComplete="email"
                        className="login-form__input"
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        {...register('email')}
                    />
                </div>

                {errors.email && (
                    <p id="email-error" className="login-form__error">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div className="login-form__field">
                <label className="login-form__label" htmlFor="password">
                    Contraseña
                </label>

                <div className={containerClass(errors.password)}>
                    <LockKeyhole className="login-form__icon" size={20} aria-hidden="true" />

                    <input
                        id="password"
                        type={mostrarPassword ? 'text' : 'password'}
                        placeholder="Tu contraseña"
                        autoComplete="current-password"
                        className="login-form__input"
                        aria-invalid={errors.password ? 'true' : 'false'}
                        aria-describedby={errors.password ? 'password-error' : undefined}
                        {...register('password')}
                    />

                    <button
                        type="button"
                        className="login-form__password-toggle"
                        onClick={() => setMostrarPassword((prev) => !prev)}
                        aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                        {mostrarPassword
                            ? <EyeOff size={20} aria-hidden="true" />
                            : <Eye size={20} aria-hidden="true" />
                        }
                    </button>
                </div>

                {errors.password && (
                    <p id="password-error" className="login-form__error">
                        {errors.password.message}
                    </p>
                )}
            </div>

            {loginMutation.isError && (
                <div className="login-form__server-error" role="alert">
                    {errorLogin.general || 'Correo o contraseña incorrectos'}
                </div>
            )}

            <button
                type="submit"
                className="login-form__submit"
                disabled={loginMutation.isPending}
            >
                {loginMutation.isPending
                    ? <Loader2 className="login-form__spinner" size={20} aria-hidden="true" />
                    : <LogIn size={20} aria-hidden="true" />
                }
                {loginMutation.isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
        </form>
    )
}
