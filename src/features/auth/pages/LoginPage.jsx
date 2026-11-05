import { Coffee } from 'lucide-react'
import LoginForm from '../components/LoginForm'
import './LoginPage.css'

const FONDO = 'suave'
const estiloFoto = undefined

export default function LoginPage() {
    return (
        <main
            className={`login-page login-page--${FONDO}`}
            style={FONDO === 'foto' ? estiloFoto : undefined}
        >
            <section className="login-page__container">
                <span className="login-page__badge" aria-hidden="true">
                    <Coffee size={30} />
                </span>

                <h1 className="login-page__title">
                    Bienvenido
                </h1>

                <p className="login-page__description">
                    Inicia sesión para acceder al sistema de cafetería.
                </p>

                <div className="login-page__form">
                    <LoginForm />
                </div>
            </section>
        </main>
    )
}
