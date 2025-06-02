const express = require("express")
const { body } = require("express-validator")
const auth = require("../middleware/auth")
const { register, login, getCurrentUser, logout } = require("../controllers/authController")

const router = express.Router()

// POST /api/auth/register - Register user
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail().withMessage("Email inválido"),
    body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    body("nombre").trim().isLength({ min: 2 }).withMessage("El nombre debe tener al menos 2 caracteres"),
    body("rol").isIn(["admin", "operador"]).withMessage("Rol inválido"),
  ],
  register
)

// POST /api/auth/login - Login user
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").exists()
  ],
  login
)

// GET /api/auth/me - Get current user
router.get("/me", auth, getCurrentUser)

// POST /api/auth/logout - Logout user
router.post("/logout", auth, logout)

module.exports = router