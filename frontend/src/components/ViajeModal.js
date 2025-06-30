"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X, Save, Truck } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import { viajeSchema } from "../schemas/viaje.schema"

const ViajeModal = ({ viaje, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!viaje

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(viajeSchema),
    defaultValues: {
      camion: "",
      conductor: "",
      origen: "",
      destino: "",
      combustible: "",
      cantidad_litros: "",
      fecha_salida: "",
      observaciones: "",
      estado: isEditing ? viaje?.estado : "Programado",
    },
  })

  // Load trip data if editing
  useEffect(() => {
    if (isEditing) {
      setValue("camion", viaje.camion)
      setValue("conductor", viaje.conductor)
      setValue("origen", viaje.origen)
      setValue("destino", viaje.destino)
      setValue("combustible", viaje.combustible)
      setValue("cantidad_litros", viaje.cantidad_litros)
      setValue("fecha_salida", new Date(viaje.fecha_salida).toISOString().slice(0, 16))
      setValue("estado", viaje.estado)
      setValue("observaciones", viaje.observaciones || "")
    }
  }, [viaje, isEditing, setValue])

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const viajeData = {
        ...data,
        cantidad_litros: Number.parseInt(data.cantidad_litros),
      }

      if (isEditing) {
        await axios.put(`/viajes/${viaje.id}`, viajeData)
        toast.success("Viaje actualizado exitosamente")
      } else {
        await axios.post("/viajes", viajeData)
        toast.success("Viaje creado exitosamente")
      }

      onSuccess()
    } catch (error) {
      console.error("Error guardando viaje:", error)
      const message = error.response?.data?.message || "Error al guardar el viaje"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{isEditing ? "Editar Viaje" : "Nuevo Viaje"}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Camión y Conductor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patente del Camión *</label>
              <input
                {...register("camion")}
                type="text"
                className="input-field uppercase"
                placeholder="ABC123"
              />
              {errors.camion && <p className="mt-1 text-sm text-red-600">{errors.camion.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Conductor *</label>
              <input
                {...register("conductor")}
                type="text"
                className="input-field"
                placeholder="Juan Pérez"
              />
              {errors.conductor && <p className="mt-1 text-sm text-red-600">{errors.conductor.message}</p>}
            </div>
          </div>

          {/* Origen y Destino */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Origen *</label>
              <input
                {...register("origen")}
                type="text"
                className="input-field"
                placeholder="Planta X"
              />
              {errors.origen && <p className="mt-1 text-sm text-red-600">{errors.origen.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Destino *</label>
              <input
                {...register("destino")}
                type="text"
                className="input-field"
                placeholder="Estación Y"
              />
              {errors.destino && <p className="mt-1 text-sm text-red-600">{errors.destino.message}</p>}
            </div>
          </div>

          {/* Combustible y Cantidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Combustible *</label>
              <select {...register("combustible")} className="input-field">
                <option value="">Seleccionar...</option>
                <option value="Diésel">Diésel</option>
                <option value="Nafta Super">Nafta Super</option>
                <option value="Nafta Premium">Nafta Premium</option>
                <option value="GNC">GNC</option>
                <option value="GLP">GLP</option>
              </select>
              {errors.combustible && <p className="mt-1 text-sm text-red-600">{errors.combustible.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad (Litros) *</label>
              <input
                {...register("cantidad_litros", { valueAsNumber: true })}
                type="number"
                className="input-field"
                placeholder="15000"
              />
              {errors.cantidad_litros && <p className="mt-1 text-sm text-red-600">{errors.cantidad_litros.message}</p>}
            </div>
          </div>

          {/* Fecha y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Salida *</label>
              <input
                {...register("fecha_salida")}
                type="datetime-local"
                className="input-field"
              />
              {errors.fecha_salida && <p className="mt-1 text-sm text-red-600">{errors.fecha_salida.message}</p>}
            </div>

            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select {...register("estado")} className="input-field">
                  <option value="Programado">Programado</option>
                  <option value="En tránsito">En tránsito</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
                {errors.estado && <p className="mt-1 text-sm text-red-600">{errors.estado.message}</p>}
              </div>
            )}
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
            <textarea
              {...register("observaciones")}
              className="input-field"
              rows={3}
              placeholder="Observaciones adicionales..."
            />
            {errors.observaciones && <p className="mt-1 text-sm text-red-600">{errors.observaciones.message}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={isLoading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary flex items-center gap-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEditing ? "Actualizar" : "Crear"} Viaje
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ViajeModal