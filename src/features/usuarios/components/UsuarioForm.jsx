import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { crearUsuarioSchema, editarUsuarioSchema } from '../schemas/login.schema'
import { useRoles } from '../hooks/useUsuarios'
import Input from '@/shared/components/Input/Input'
import Select from '@/shared/components/Select/Select'
import './UsuarioForm.css'

export default function UsuarioForm({
    usuario,
    onSubmit,
    isPending = false
}) {
    const esEdicion = Boolean(usuario?.id)
    const { data: roles = [], isLoading: cargandoRoles } = useRoles()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(
            esEdicion ? editarUsuarioSchema : crearUsuarioSchema
        ),
        defaultValues: {
            nombre: '',
            apellido_p: '',
            apellido_m: '',
            email: '',
            password: '',
            id_rol: ''
        }
    })

    useEffect(() => {
        reset({
            nombre: usuario?.nombre ?? '',
            apellido_p: usuario?.apellido_p ?? '',
            apellido_m: usuario?.apellido_m ?? '',
            email: usuario?.email ?? '',
            password: '',
            id_rol: usuario?.id_rol ?? ''
        })
    }, [usuario, reset])

    const enviarFormulario = (datos) => {
        const { password, ...datosUsuario } = datos

        if (esEdicion) {
            onSubmit({
                ...datosUsuario,
                activo: usuario.activo,
                ...(password ? { password } : {})
            })
            return
        }

        onSubmit(datos)
    }

    return (
        <form
            id="form-usuario"
            className="usuario-form"
            onSubmit={handleSubmit(enviarFormulario)}
        >
            <Input
                label="Nombre"
                id="nombre"
                type="text"
                autoComplete="given-name"
                disabled={isPending}
                error={errors.nombre?.message}
                {...register('nombre')}
            />

            <Input
                label="Apellido paterno"
                id="apellido_p"
                type="text"
                autoComplete="family-name"
                disabled={isPending}
                error={errors.apellido_p?.message}
                {...register('apellido_p')}
            />

            <Input
                label="Apellido materno"
                id="apellido_m"
                type="text"
                disabled={isPending}
                error={errors.apellido_m?.message}
                {...register('apellido_m')}
            />

            <Input
                label="Correo electrónico"
                id="email"
                type="email"
                autoComplete="email"
                disabled={isPending}
                error={errors.email?.message}
                {...register('email')}
            />
{/* 
            <Input
                label={`Contraseña ${esEdicion ? '(opcional)' : ''}`}
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder={
                    esEdicion
                        ? 'Dejar vacío para conservar la actual'
                        : ''
                }
                disabled={isPending}
                error={errors.password?.message}
                {...register('password')}
            />
*/}
            <Select
                label="Rol"
                id="id_rol"
                options={roles.map((rol) => ({
                    value: rol.id,
                    label: rol.nombre
                }))}
                placeholder={
                    cargandoRoles
                        ? 'Cargando roles...'
                        : 'Selecciona un rol'
                }
                error={errors.id_rol?.message}
                disabled={cargandoRoles || isPending}
                {...register('id_rol')}
            />
        </form>
    )
}