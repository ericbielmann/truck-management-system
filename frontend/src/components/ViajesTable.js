"use client"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import LoadingSpinner from "./LoadingSpinner"

const ViajesTable = ({ viajes, loading, pagination, onPageChange, onEdit, onDelete, onSort, currentSort }) => {
  const getStatusBadge = (estado) => {
    const statusClasses = {
      Programado: "status-badge status-programado",
      "En tránsito": "status-badge status-en-transito",
      Entregado: "status-badge status-entregado",
      Cancelado: "status-badge status-cancelado",
    }

    return <span className={statusClasses[estado] || "status-badge"}>{estado}</span>
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: es })
    } catch (error) {
      return "Fecha inválida"
    }
  }

  const formatNumber = (number) => {
    return new Intl.NumberFormat("es-AR").format(number)
  }

  const handleSort = (field) => {
    const newOrder = currentSort.sortBy === field && currentSort.sortOrder === "asc" ? "desc" : "asc"
    onSort(field, newOrder)
  }

  const getSortIcon = (field) => {
    if (currentSort.sortBy !== field) return null
    return currentSort.sortOrder === "asc" ? "↑" : "↓"
  }

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (viajes.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 text-lg">No se encontraron viajes</p>
        <p className="text-gray-400 text-sm mt-2">Intenta ajustar los filtros o crear un nuevo viaje</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="table-header">
            <tr>
              <th className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort("camion")}>
                Camión {getSortIcon("camion")}
              </th>
              <th
                className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("conductor")}
              >
                Conductor {getSortIcon("conductor")}
              </th>
              <th className="px-6 py-3 text-left">Ruta</th>
              <th
                className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("combustible")}
              >
                Combustible {getSortIcon("combustible")}
              </th>
              <th
                className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("cantidad_litros")}
              >
                Litros {getSortIcon("cantidad_litros")}
              </th>
              <th
                className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("fecha_salida")}
              >
                Fecha Salida {getSortIcon("fecha_salida")}
              </th>
              <th className="px-6 py-3 text-left">Estado</th>
              <th className="px-6 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {viajes.map((viaje) => (
              <tr key={viaje.id} className="hover:bg-gray-50">
                <td className="table-cell font-medium">{viaje.camion}</td>
                <td className="table-cell">{viaje.conductor}</td>
                <td className="table-cell">
                  <div className="text-sm">
                    <div className="font-medium">{viaje.origen}</div>
                    <div className="text-gray-500">→ {viaje.destino}</div>
                  </div>
                </td>
                <td className="table-cell">{viaje.combustible}</td>
                <td className="table-cell">{formatNumber(viaje.cantidad_litros)} L</td>
                <td className="table-cell">{formatDate(viaje.fecha_salida)}</td>
                <td className="table-cell">{getStatusBadge(viaje.estado)}</td>
                <td className="table-cell">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(viaje)}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      title="Editar viaje"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {viaje.estado !== "Cancelado" && (
                      <button
                        onClick={() => onDelete(viaje.id)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        title="Cancelar viaje"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {pagination.total_pages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => onPageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.total_pages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando{" "}
                <span className="font-medium">{(pagination.current_page - 1) * pagination.items_per_page + 1}</span> a{" "}
                <span className="font-medium">
                  {Math.min(pagination.current_page * pagination.items_per_page, pagination.total_items)}
                </span>{" "}
                de <span className="font-medium">{pagination.total_items}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Números de página */}
                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === pagination.current_page
                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => onPageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.total_pages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViajesTable
