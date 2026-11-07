import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { crearIngredienteSchema, editarIngredienteSchema } from '../schemas/ingrediente.schema'
import Input from '@/shared/components/Input/Input'
import './IngredienteForm.css'

export default function IngredienteForm({
    ingrediente,
    onSubmit,
    isPending = false
}) {
    const esEdicion = Boolean(ingrediente?.id)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(
            esEdicion ? editarIngredienteSchema : crearIngredienteSchema
        ),
        defaultValues: {
            nombre: ''
        }
    })

    useEffect(() => {
        reset({
            nombre: ingrediente?.nombre ?? ''
        })
    }, [ingrediente, reset])

    const enviarFormulario = (datos) => {
        onSubmit(datos)
    }

    return (
        <form
            id="form-ingrediente"
            className="ingrediente-form"
            onSubmit={handleSubmit(enviarFormulario)}
        >
            <Input
                label="Nombre del ingrediente"
                id="nombre"
                type="text"
                autoComplete="off"
                disabled={isPending}
                error={errors.nombre?.message}
                {...register('nombre')}
            />
        </form>
    )
}