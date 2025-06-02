const { body } = require("express-validator")

const registerValidators = [
  body("email").isEmail().normalizeEmail().withMessage("Email inválido"),
  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("nombre").trim().isLength({ min: 2 }).withMessage("El nombre debe tener al menos 2 caracteres"),
  body("rol").isIn(["admin", "operador"]).withMessage("Rol inválido"),
]

const loginValidators = [
  body("email").isEmail().normalizeEmail(),
  body("password").exists()
]

module.exports = {
  registerValidators,
  loginValidators
}