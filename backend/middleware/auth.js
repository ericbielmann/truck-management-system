const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "Token de acceso requerido" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select("-password")

    if (!user || !user.activo) {
      return res.status(401).json({ message: "Token inválido o usuario inactivo" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Error en middleware de autenticación:", error)
    res.status(401).json({ message: "Token inválido" })
  }
}

module.exports = auth
