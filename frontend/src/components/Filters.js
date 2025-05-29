"use client"
import { Search, Filter, Eye, EyeOff } from "lucide-react"

const Filters = ({ filters, onFilterChange }) => {
  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value })
  }

  const handleToggleCanceled = () => {
    onFilterChange({ showCanceled: !filters.showCanceled })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Búsqueda por conductor */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar conductor..."
          value={filters.conductor}
          onChange={(e) => handleInputChange("conductor", e.target.value)}
          className="input-field pl-10 w-full sm:w-[14rem]"
        />
      </div>

      {/* Filtro por estado */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400" />
        <select
          value={filters.estado}
          onChange={(e) => handleInputChange("estado", e.target.value)}
          className="input-field w-full sm:w-auto"
        >
          <option value="">Todos los estados</option>
          <option value="Programado">Programado</option>
          <option value="En tránsito">En tránsito</option>
          <option value="Entregado">Entregado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      {/* Filtro por combustible */}
      <select
        value={filters.combustible}
        onChange={(e) => handleInputChange("combustible", e.target.value)}
        className="input-field w-full sm:w-auto"
      >
        <option value="">Todos los combustibles</option>
        <option value="Diésel">Diésel</option>
        <option value="Nafta Super">Nafta Super</option>
        <option value="Nafta Premium">Nafta Premium</option>
        <option value="GNC">GNC</option>
        <option value="GLP">GLP</option>
      </select>

      {/* Ordenamiento */}
      <select
        value={`${filters.sortBy}-${filters.sortOrder}`}
        onChange={(e) => {
          const [sortBy, sortOrder] = e.target.value.split("-")
          onFilterChange({ sortBy, sortOrder })
        }}
        className="input-field w-full sm:w-auto"
      >
        <option value="fecha_salida-desc">Fecha (más reciente)</option>
        <option value="fecha_salida-asc">Fecha (más antigua)</option>
        <option value="conductor-asc">Conductor (A-Z)</option>
        <option value="conductor-desc">Conductor (Z-A)</option>
        <option value="cantidad_litros-desc">Litros (mayor)</option>
        <option value="cantidad_litros-asc">Litros (menor)</option>
      </select>

      {/* Toggle para mostrar/ocultar cancelados */}
      <button
        onClick={handleToggleCanceled}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          filters.showCanceled
            ? "bg-red-100 text-red-700 hover:bg-red-200"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        title={filters.showCanceled ? "Ocultar cancelados" : "Mostrar cancelados"}
      >
        {filters.showCanceled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        <span className="hidden sm:inline">{filters.showCanceled ? "Ocultar" : "Mostrar"} cancelados</span>
      </button>
    </div>
  )
}

export default Filters
