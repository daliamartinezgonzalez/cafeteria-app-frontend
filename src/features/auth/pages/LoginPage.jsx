import { Coffee } from 'lucide-react'
import LoginForm from '../components/LoginForm'
import './LoginPage.css'

export default function LoginPage() {
    return (
        <main className="login-page">
            <section className="login-page__container">
                {/* Icono representativo de la cafetería */}
                <span className="login-page__badge" aria-hidden="true">
                    <Coffee size={30} />
                </span>

                <h1 className="login-page__title">
                    Bienvenido
                </h1>

                <p className="login-page__description">
                    Inicia sesión para acceder al sistema de cafetería.
                </p>

                {/* Formulario de inicio de sesión */}
                <div className="login-page__form">
                    <LoginForm />
                </div>
            </section>
        </main>
    )
}