import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { crearCategoriaSchema, editarCategoriaSchema } from '../schemas/categoria.schema'
import Input from '@/shared/components/Input/Input'
import './CategoriaForm.css'

export default function CategoriaForm({
    categoria,
    onSubmit,
    isPending = false
}) {
    const esEdicion = Boolean(categoria?.id)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(
            esEdicion ? editarCategoriaSchema : crearCategoriaSchema
        ),
        defaultValues: {
            nombre_categoria: ''
        }
    })

    useEffect(() => {
        reset({
            nombre_categoria: categoria?.nombre_categoria ?? ''
        })
    }, [categoria, reset])

    const enviarFormulario = (datos) => {
        onSubmit(datos)
    }

    return (
        <form
            id="form-categoria"
            className="categoria-form"
            onSubmit={handleSubmit(enviarFormulario)}
        >
            <Input
                label="Nombre de la categoría"
                id="nombre_categoria"
                type="text"
                autoComplete="off"
                disabled={isPending}
                error={errors.nombre_categoria?.message}
                {...register('nombre_categoria')}
            />
        </form>
    )
}