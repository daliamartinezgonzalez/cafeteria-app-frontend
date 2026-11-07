import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { crearBebidaSchema, editarBebidaSchema } from '../../schemas/bebidas.schema'
import { useCategorias } from '@/features/categorias/hooks/useCategorias'
import { useIngredientes } from '@/features/ingredientes/hooks/useIngredientes'
import Input from '@/shared/components/Input/Input'
import Select from '@/shared/components/Select/Select'
import './BebidaForm.css'

export default function BebidaForm({
    bebida,
    onSubmit,
    isPending = false
}) {
    const esEdicion = Boolean(bebida?.id)

    const { data: categorias = [], isLoading: cargandoCategorias } = useCategorias()
    const { data: ingredientesDisponibles = [], isLoading: cargandoIngredientes } = useIngredientes()

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(
            esEdicion ? editarBebidaSchema : crearBebidaSchema
        ),
        defaultValues: {
            nombre: '',
            descripcion: '',
            precio: '',
            tamaño: '',
            imagen_url: '',
            id_categoria: '',
            ingredientes: [
                {
                    id_ingrediente: '',
                    cantidad: '',
                    unidad: ''
                }
            ]
        }
    })

    const {
        fields,
        append,
        remove
    } = useFieldArray({
        control,
        name: 'ingredientes'
    })

    useEffect(() => {
        reset({
            nombre: bebida?.nombre ?? '',
            descripcion: bebida?.descripcion ?? '',
            precio: bebida?.precio ?? '',
            tamaño: bebida?.tamaño ?? '',
            imagen_url: bebida?.imagen_url ?? '',
            id_categoria: bebida?.id_categoria ?? '',
            ingredientes: bebida?.ingredientes?.length
                ? bebida.ingredientes.map((ingrediente) => ({
                    id_ingrediente: ingrediente.id_ingrediente,
                    cantidad: ingrediente.cantidad,
                    unidad: ingrediente.unidad
                }))
                : [
                    {
                        id_ingrediente: '',
                        cantidad: '',
                        unidad: ''
                    }
                ]
        })
    }, [bebida, reset])

    const enviarFormulario = (datos) => {
        onSubmit(datos)
    }

    const opcionesCategorias = categorias.map((categoria) => ({
        value: categoria.id,
        label: categoria.nombre_categoria
    }))

    const opcionesIngredientes = ingredientesDisponibles.map((ingrediente) => ({
        value: ingrediente.id,
        label: ingrediente.nombre
    }))

    return (
        <form
            id="form-bebida"
            className="bebida-form"
            onSubmit={handleSubmit(enviarFormulario)}
        >
            <Input
                label="Nombre"
                id="nombre"
                type="text"
                disabled={isPending}
                error={errors.nombre?.message}
                {...register('nombre')}
            />

            <Input
                label="Descripción"
                id="descripcion"
                type="text"
                disabled={isPending}
                error={errors.descripcion?.message}
                {...register('descripcion')}
            />

            <Input
                label="Precio"
                id="precio"
                type="number"
                min="0"
                step="0.01"
                disabled={isPending}
                error={errors.precio?.message}
                {...register('precio')}
            />

            <Input
                label="Tamaño"
                id="tamaño"
                type="text"
                placeholder="Ej. 350 ml"
                disabled={isPending}
                error={errors.tamaño?.message}
                {...register('tamaño')}
            />

            <Input
                label="URL de imagen"
                id="imagen_url"
                type="text"
                placeholder="https://..."
                disabled={isPending}
                error={errors.imagen_url?.message}
                {...register('imagen_url')}
            />

            <Select
                label="Categoría"
                id="id_categoria"
                options={opcionesCategorias}
                placeholder={
                    cargandoCategorias
                        ? 'Cargando categorías...'
                        : 'Selecciona una categoría'
                }
                error={errors.id_categoria?.message}
                disabled={cargandoCategorias || isPending}
                {...register('id_categoria')}
            />

            <div className="bebida-form__ingredientes">
                <div className="bebida-form__ingredientes-header">
                    <h3>Ingredientes</h3>

                    <button
                        type="button"
                        className="bebida-form__agregar"
                        onClick={() => append({
                            id_ingrediente: '',
                            cantidad: '',
                            unidad: ''
                        })}
                        disabled={isPending}
                    >
                        <Plus size={17} />
                        Agregar ingrediente
                    </button>
                </div>

                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="bebida-form__ingrediente"
                    >
                        <Select
                            label="Ingrediente"
                            id={`ingrediente-${index}`}
                            options={opcionesIngredientes}
                            placeholder={
                                cargandoIngredientes
                                    ? 'Cargando ingredientes...'
                                    : 'Selecciona un ingrediente'
                            }
                            error={errors.ingredientes?.[index]?.id_ingrediente?.message}
                            disabled={cargandoIngredientes || isPending}
                            {...register(`ingredientes.${index}.id_ingrediente`)}
                        />

                        <Input
                            label="Cantidad"
                            id={`cantidad-${index}`}
                            type="number"
                            min="0"
                            step="any"
                            disabled={isPending}
                            error={errors.ingredientes?.[index]?.cantidad?.message}
                            {...register(`ingredientes.${index}.cantidad`)}
                        />

                        <Input
                            label="Unidad"
                            id={`unidad-${index}`}
                            type="text"
                            placeholder="Ej. gramos, ml"
                            disabled={isPending}
                            error={errors.ingredientes?.[index]?.unidad?.message}
                            {...register(`ingredientes.${index}.unidad`)}
                        />

                        {fields.length > 1 && (
                            <button
                                type="button"
                                className="bebida-form__eliminar"
                                onClick={() => remove(index)}
                                disabled={isPending}
                                aria-label={`Eliminar ingrediente ${index + 1}`}
                                title="Eliminar ingrediente"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                ))}

                {errors.ingredientes?.root?.message && (
                    <p className="bebida-form__error">
                        {errors.ingredientes.root.message}
                    </p>
                )}
            </div>
        </form>
    )
}