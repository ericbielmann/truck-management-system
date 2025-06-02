const express = require("express")
const auth = require("../middleware/auth")
const { 
  getViajesValidators, 
  createViajeValidators, 
  updateViajeValidators 
} = require("../middleware/validators/viajesValidators")
const validateRequest = require("../middleware/validators/validateRequest")
const {
  getViajes,
  getViaje,
  createViaje,
  updateViaje,z
  deleteViaje,
  getDashboardStats,
} = require("../controllers/viajesController")

const router = express.Router()

// Apply auth middleware to all routes
router.use(auth)

// GET /api/viajes - Get all trips with filters and pagination
router.get("/", getViajesValidators, validateRequest, getViajes)

// GET /api/viajes/:id - Get specific trip
router.get("/:id", getViaje)

// POST /api/viajes - Create new trip
router.post("/", createViajeValidators, validateRequest, createViaje)

// PUT /api/viajes/:id - Update trip
router.put("/:id", updateViajeValidators, validateRequest, updateViaje)

// DELETE /api/viajes/:id - Delete (cancel) trip
router.delete("/:id", deleteViaje)

// GET /api/viajes/stats/dashboard - Get dashboard stats
router.get("/stats/dashboard", getDashboardStats)

module.exports = router