const { body, query } = require("express-validator")

const getViajesValidators = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("estado").optional().isIn(["Programado", "En tránsito", "Entregado", "Cancelado"]),
  query("combustible").optional().isIn(["Diésel", "Nafta Super", "Nafta Premium", "GNC", "GLP"]),
  query("conductor").optional().trim(),
  query("sortBy").optional().isIn(["fecha_salida", "conductor", "estado", "cantidad_litros"]),
  query("sortOrder").optional().isIn(["asc", "desc"]),
  query("excludeStatus").optional().isString(),
  query("showCanceled").optional().isBoolean(),
]

const createViajeValidators = [
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
]

const updateViajeValidators = [
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
]

module.exports = {
  getViajesValidators,
  createViajeValidators,
  updateViajeValidators
}