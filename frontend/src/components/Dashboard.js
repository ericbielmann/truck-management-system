"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import ViajesTable from "./ViajesTable"
import ViajeModal from "./ViajeModal"
import StatsCards from "./StatsCards"
import TripChart from "./TripChart"
import Header from "./Header"
import Filters from "./Filters"
import { Plus } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

const Dashboard = () => {
  const { user } = useAuth()
  const [viajes, setViajes] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedViaje, setSelectedViaje] = useState(null)
  const [filters, setFilters] = useState({
    estado: "",
    combustible: "",
    conductor: "",
    sortBy: "fecha_salida",
    sortOrder: "desc",
    showCanceled: false,
  })
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 10,
  })

  // Cargar viajes
  const loadViajes = async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.items_per_page.toString(),
        ...filters,
      })

      // Remover parámetros vacíos
      Object.keys(filters).forEach((key) => {
        if (!filters[key] && key !== "showCanceled") {
          params.delete(key)
        }
      })

      // Si no queremos mostrar cancelados, excluirlos
      if (!filters.showCanceled) {
        params.delete("showCanceled")
        // Si no hay filtro de estado específico, excluir cancelados
        if (!filters.estado) {
          params.set("excludeStatus", "Cancelado")
        }
      }

      const response = await axios.get(`/viajes?${params}`)
      setViajes(response.data.viajes)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error("Error cargando viajes:", error)
      toast.error("Error al cargar los viajes")
    } finally {
      setLoading(false)
    }
  }

  // Cargar estadísticas
  const loadStats = async () => {
    try {
      const response = await axios.get("/viajes/stats/dashboard")
      setStats(response.data)
    } catch (error) {
      console.error("Error cargando estadísticas:", error)
    }
  }

  // Efectos
  useEffect(() => {
    loadViajes()
    loadStats()
  }, [filters])

  // Handlers
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const handlePageChange = (page) => {
    loadViajes(page)
  }

  const handleCreateViaje = () => {
    setSelectedViaje(null)
    setIsModalOpen(true)
  }

  const handleEditViaje = (viaje) => {
    setSelectedViaje(viaje)
    setIsModalOpen(true)
  }

  const handleDeleteViaje = async (viajeId) => {
    if (!window.confirm("¿Estás seguro de que quieres cancelar este viaje?")) {
      return
    }

    try {
      await axios.delete(`/viajes/${viajeId}`)
      toast.success("Viaje cancelado exitosamente")

      // Recargar la página actual para reflejar los cambios
      loadViajes(pagination.current_page)
      loadStats()
    } catch (error) {
      console.error("Error cancelando viaje:", error)
      toast.error("Error al cancelar el viaje")
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedViaje(null)
  }

  const handleModalSuccess = () => {
    loadViajes(pagination.current_page)
    loadStats()
    handleModalClose()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Estadísticas */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard de Viajes</h1>
          <StatsCards stats={stats} />
        </div>

        {/* Chart */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Evolución de Viajes</h2>
          <TripChart viajes={viajes} />
        </div>

        {/* Filtros y botón de crear */}
        <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <Filters filters={filters} onFilterChange={handleFilterChange} />

          <button onClick={handleCreateViaje} className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <Plus className="h-4 w-4" />
            Nuevo Viaje
          </button>
        </div>

        {/* Tabla de viajes */}
        <div className="card">
          <ViajesTable
            viajes={viajes}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onEdit={handleEditViaje}
            onDelete={handleDeleteViaje}
            onSort={(sortBy, sortOrder) => handleFilterChange({ sortBy, sortOrder })}
            currentSort={{
              sortBy: filters.sortBy,
              sortOrder: filters.sortOrder,
            }}
          />
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && <ViajeModal viaje={selectedViaje} onClose={handleModalClose} onSuccess={handleModalSuccess} />}
    </div>
  )
}

export default Dashboard