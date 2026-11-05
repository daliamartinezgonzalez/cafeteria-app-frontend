import { useAuthBootstrap } from '@/features/auth/hooks/useAuthBootstrap'

// Verifica si aún tiene un token y si puede entrar.
export default function AuthProvider({ children }) {
    useAuthBootstrap()
    return children
}