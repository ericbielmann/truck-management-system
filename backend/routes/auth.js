const express = require("express")
const auth = require("../middleware/auth")
const { registerValidators, loginValidators } = require("../middleware/validators/authValidators")
const validateRequest = require("../middleware/validators/validateRequest")
const { register, login, getCurrentUser, logout } = require("../controllers/authController")

const router = express.Router()

// POST /api/auth/register - Register user
router.post("/register", registerValidators, validateRequest, register)

// POST /api/auth/login - Login user
router.post("/login", loginValidators, validateRequest, login)

// GET /api/auth/me - Get current user
router.get("/me", auth, getCurrentUser)

// POST /api/auth/logout - Logout user
router.post("/logout", auth, logout)

module.exports = router