const express = require("express")
const { body, validationResult, query } = require("express-validator")
const Viaje = require("../models/Viaje")
const auth = require("../middleware/auth")

const router = express.Router()

// Aplicar middleware de autenticación a todas las rutas
router.use(auth)

// GET /api/viajes - Obtener todos los viajes con filtros y paginación
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("estado").optional().isIn(["Programado", "En tránsito", "Entregado", "Cancelado"]),
    query("combustible").optional().isIn(["Diésel", "Nafta Super", "Nafta Premium", "GNC", "GLP"]),
    query("conductor").optional().trim(),
    query("sortBy").optional().isIn(["fecha_salida", "conductor", "estado", "cantidad_litros"]),
    query("sortOrder").optional().isIn(["asc", "desc"]),
    query("excludeStatus").optional().isString(),
    query("showCanceled").optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Parámetros de consulta inválidos",
          errors: errors.array(),
        })
      }

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

      // Construir filtros
      const filters = {}
      if (estado) filters.estado = estado
      if (combustible) filters.combustible = combustible
      if (conductor) filters.conductor = new RegExp(conductor, "i")

      // Excluir estados específicos (como cancelados)
      if (excludeStatus) {
        filters.estado = { $ne: excludeStatus }
      }

      console.log("Filtros aplicados:", filters)

      // Construir ordenamiento
      const sort = {}
      sort[sortBy] = sortOrder === "asc" ? 1 : -1

      // Ejecutar consulta con paginación
      const skip = (page - 1) * limit
      const viajes = await Viaje.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(Number.parseInt(limit))
        .populate("creado_por", "nombre email")

      // Contar total de documentos
      const total = await Viaje.countDocuments(filters)

      console.log(`Encontrados ${viajes.length} viajes de ${total} total`)

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
      console.error("Error obteniendo viajes:", error)
      res.status(500).json({ message: "Error interno del servidor" })
    }
  },
)

// GET /api/viajes/:id - Obtener un viaje específico
router.get("/:id", async (req, res) => {
  try {
    const viaje = await Viaje.findOne({ id: req.params.id }).populate("creado_por", "nombre email")

    if (!viaje) {
      return res.status(404).json({ message: "Viaje no encontrado" })
    }

    res.json(viaje)
  } catch (error) {
    console.error("Error obteniendo viaje:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
})

// POST /api/viajes - Crear nuevo viaje
router.post(
  "/",
  [
    body("camion")
      .trim()
      .isLength({ min: 6, max: 8 })
      .matches(/^[A-Z0-9]+$/),
    body("conductor").trim().isLength({ min: 2 }),
    body("origen").trim().isLength({ min: 2 }),
    body("destino").trim().isLength({ min: 2 }),
    body("combustible").isIn(["Diésel", "Nafta Super", "Nafta Premium", "GNC", "GLP"]),
    body("cantidad_litros").isInt({ min: 1, max: 30000 }),
    body("fecha_salida").isISO8601(),
    body("observaciones").optional().trim().isLength({ max: 500 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Datos inválidos",
          errors: errors.array(),
        })
      }

      // Validar que la fecha no sea en el pasado
      const fechaSalida = new Date(req.body.fecha_salida)
      if (fechaSalida < new Date()) {
        return res.status(400).json({
          message: "La fecha de salida no puede ser en el pasado",
        })
      }

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
      console.error("Error creando viaje:", error)
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Error de validación",
          errors: Object.values(error.errors).map((e) => e.message),
        })
      }
      res.status(500).json({ message: "Error interno del servidor" })
    }
  },
)

// PUT /api/viajes/:id - Actualizar viaje
router.put(
  "/:id",
  [
    body("camion")
      .optional()
      .trim()
      .isLength({ min: 6, max: 8 })
      .matches(/^[A-Z0-9]+$/),
    body("conductor").optional().trim().isLength({ min: 2 }),
    body("origen").optional().trim().isLength({ min: 2 }),
    body("destino").optional().trim().isLength({ min: 2 }),
    body("combustible").optional().isIn(["Diésel", "Nafta Super", "Nafta Premium", "GNC", "GLP"]),
    body("cantidad_litros").optional().isInt({ min: 1, max: 30000 }),
    body("fecha_salida").optional().isISO8601(),
    body("estado").optional().isIn(["Programado", "En tránsito", "Entregado", "Cancelado"]),
    body("observaciones").optional().trim().isLength({ max: 500 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Datos inválidos",
          errors: errors.array(),
        })
      }

      // Validar fecha si se proporciona
      if (req.body.fecha_salida) {
        const fechaSalida = new Date(req.body.fecha_salida)
        if (fechaSalida < new Date()) {
          return res.status(400).json({
            message: "La fecha de salida no puede ser en el pasado",
          })
        }
      }

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
      console.error("Error actualizando viaje:", error)
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Error de validación",
          errors: Object.values(error.errors).map((e) => e.message),
        })
      }
      res.status(500).json({ message: "Error interno del servidor" })
    }
  },
)

// DELETE /api/viajes/:id - Eliminación lógica (cancelar viaje)
router.delete("/:id", async (req, res) => {
  try {
    const viaje = await Viaje.findOneAndUpdate({ id: req.params.id }, { estado: "Cancelado" }, { new: true }).populate(
      "creado_por",
      "nombre email",
    )

    if (!viaje) {
      return res.status(404).json({ message: "Viaje no encontrado" })
    }

    console.log(`Viaje ${req.params.id} cancelado exitosamente`)

    res.json({
      message: "Viaje cancelado exitosamente",
      viaje,
    })
  } catch (error) {
    console.error("Error cancelando viaje:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
})

// GET /api/viajes/stats/dashboard - Estadísticas para dashboard
router.get("/stats/dashboard", async (req, res) => {
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
    console.error("Error obteniendo estadísticas:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
})

module.exports = router
