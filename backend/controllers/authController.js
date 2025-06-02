const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "24h" })
}

// Register new user
const register = async (req, res) => {
  try {
    console.log("Datos recibidos para registro:", req.body)
    const { email, password, nombre, rol } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log("Usuario ya existe:", email)
      return res.status(400).json({ message: "El usuario ya existe" })
    }

    // Create new user
    const user = new User({ email, password, nombre, rol })
    await user.save()
    console.log("Usuario creado exitosamente:", user.email)

    // Generate token
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
}

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email, activo: true })
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" })
    }

    // Verify password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" })
    }

    // Generate token
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
}

// Get current user
const getCurrentUser = async (req, res) => {
  res.json({ user: req.user })
}

// Logout user (optional, for frontend token invalidation)
const logout = (req, res) => {
  res.json({ message: "Sesión cerrada exitosamente" })
}

module.exports = {
  register,
  login,
  getCurrentUser,
  logout,
}