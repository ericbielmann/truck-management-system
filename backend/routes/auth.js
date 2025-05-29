const express = require("express")
const jwt = require("jsonwebtoken")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")
const auth = require("../middleware/auth")

const router = express.Router()

// Generar token JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "24h" })
}

// POST /api/auth/register - Registrar usuario
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail().withMessage("Email inválido"),
    body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    body("nombre").trim().isLength({ min: 2 }).withMessage("El nombre debe tener al menos 2 caracteres"),
    body("rol").isIn(["admin", "operador"]).withMessage("Rol inválido"),
  ],
  async (req, res) => {
    try {
      console.log("Datos recibidos para registro:", req.body)

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        console.log("Errores de validación:", errors.array())
        return res.status(400).json({
          message: "Datos inválidos",
          errors: errors.array(),
        })
      }

      const { email, password, nombre, rol } = req.body

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        console.log("Usuario ya existe:", email)
        return res.status(400).json({ message: "El usuario ya existe" })
      }

      // Crear nuevo usuario
      const user = new User({ email, password, nombre, rol })
      await user.save()
      console.log("Usuario creado exitosamente:", user.email)

      // Generar token
      const token = generateToken(user._id)

      res.status(201).json({
        message: "Usuario creado exitosamente",
        token,
        user: user.toJSON(),
      })
    } catch (error) {
      console.error("Error en registro:", error)
      res.status(500).json({
        message: "Error interno del servidor",
        error: error.message,
      })
    }
  },
)

// POST /api/auth/login - Iniciar sesión
router.post("/login", [body("email").isEmail().normalizeEmail(), body("password").exists()], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Datos inválidos",
        errors: errors.array(),
      })
    }

    const { email, password } = req.body

    // Buscar usuario
    const user = await User.findOne({ email, activo: true })
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" })
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" })
    }

    // Generar token
    const token = generateToken(user._id)

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: user.toJSON(),
    })
  } catch (error) {
    console.error("Error en login:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
})

// GET /api/auth/me - Obtener usuario actual
router.get("/me", auth, async (req, res) => {
  res.json({ user: req.user })
})

// POST /api/auth/logout - Cerrar sesión (opcional, para invalidar token en frontend)
router.post("/logout", auth, (req, res) => {
  res.json({ message: "Sesión cerrada exitosamente" })
})

module.exports = router
