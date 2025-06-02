const Viaje = require("../models/Viaje")

// Get all trips with filters and pagination
const getViajes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      estado,
      combustible,
      conductor,
      sortBy = "fecha_salida",
      sortOrder = "desc",
      excludeStatus,
      showCanceled,
    } = req.query

    // Build filters
    const filters = {}
    if (estado) filters.estado = estado
    if (combustible) filters.combustible = combustible
    if (conductor) filters.conductor = new RegExp(conductor, "i")

    // Exclude specific statuses (like cancelled)
    if (excludeStatus) {
      filters.estado = { $ne: excludeStatus }
    }

    console.log("Applied filters:", filters)

    // Build sort
    const sort = {}
    sort[sortBy] = sortOrder === "asc" ? 1 : -1

    // Execute query with pagination
    const skip = (page - 1) * limit
    const viajes = await Viaje.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(Number.parseInt(limit))
      .populate("creado_por", "nombre email")

    // Count total documents
    const total = await Viaje.countDocuments(filters)

    console.log(`Found ${viajes.length} trips out of ${total} total`)

    res.json({
      viajes,
      pagination: {
        current_page: Number.parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: Number.parseInt(limit),
      },
    })
  } catch (error) {
    console.error("Error getting trips:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

// Get specific trip
const getViaje = async (req, res) => {
  try {
    const viaje = await Viaje.findOne({ id: req.params.id }).populate("creado_por", "nombre email")

    if (!viaje) {
      return res.status(404).json({ message: "Viaje no encontrado" })
    }

    res.json(viaje)
  } catch (error) {
    console.error("Error getting trip:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

// Create new trip
const createViaje = async (req, res) => {
  try {
    const viaje = new Viaje({
      ...req.body,
      creado_por: req.user._id,
    })

    await viaje.save()
    await viaje.populate("creado_por", "nombre email")

    res.status(201).json({
      message: "Viaje creado exitosamente",
      viaje,
    })
  } catch (error) {
    console.error("Error creating trip:", error)
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Error de validación",
        errors: Object.values(error.errors).map((e) => e.message),
      })
    }
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

// Update trip
const updateViaje = async (req, res) => {
  try {
    const viaje = await Viaje.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    }).populate("creado_por", "nombre email")

    if (!viaje) {
      return res.status(404).json({ message: "Viaje no encontrado" })
    }

    res.json({
      message: "Viaje actualizado exitosamente",
      viaje,
    })
  } catch (error) {
    console.error("Error updating trip:", error)
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Error de validación",
        errors: Object.values(error.errors).map((e) => e.message),
      })
    }
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

// Delete (cancel) trip
const deleteViaje = async (req, res) => {
  try {
    const viaje = await Viaje.findOneAndUpdate(
      { id: req.params.id },
      { estado: "Cancelado" },
      { new: true }
    ).populate("creado_por", "nombre email")

    if (!viaje) {
      return res.status(404).json({ message: "Viaje no encontrado" })
    }

    console.log(`Trip ${req.params.id} cancelled successfully`)

    res.json({
      message: "Viaje cancelado exitosamente",
      viaje,
    })
  } catch (error) {
    console.error("Error cancelling trip:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const stats = await Promise.all([
      Viaje.countDocuments({ estado: "Programado" }),
      Viaje.countDocuments({ estado: "En tránsito" }),
      Viaje.countDocuments({ estado: "Entregado" }),
      Viaje.countDocuments({ estado: "Cancelado" }),
      Viaje.aggregate([{ $group: { _id: null, total: { $sum: "$cantidad_litros" } } }]),
    ])

    res.json({
      programados: stats[0],
      en_transito: stats[1],
      entregados: stats[2],
      cancelados: stats[3],
      total_litros: stats[4][0]?.total || 0,
    })
  } catch (error) {
    console.error("Error getting stats:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

module.exports = {
  getViajes,
  getViaje,
  createViaje,
  updateViaje,
  deleteViaje,
  getDashboardStats,
}