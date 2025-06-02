const express = require("express")
const { body, validationResult, query } = require("express-validator")
const auth = require("../middleware/auth")
const {
  getViajes,
  getViaje,
  createViaje,
  updateViaje,
  deleteViaje,
  getDashboardStats,
} = require("../controllers/viajesController")

const router = express.Router()

// Apply auth middleware to all routes
router.use(auth)

// GET /api/viajes - Get all trips with filters and pagination
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
  getViajes
)

// GET /api/viajes/:id - Get specific trip
router.get("/:id", getViaje)

// POST /api/viajes - Create new trip
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
  createViaje
)

// PUT /api/viajes/:id - Update trip
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
  updateViaje
)

// DELETE /api/viajes/:id - Delete (cancel) trip
router.delete("/:id", deleteViaje)

// GET /api/viajes/stats/dashboard - Get dashboard stats
router.get("/stats/dashboard", getDashboardStats)

module.exports = router