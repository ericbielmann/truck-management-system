"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider")
  }
  return context
}

// Configurar axios - Always use localhost for browser requests
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api"
axios.defaults.baseURL = API_URL

console.log("API_URL configurada:", API_URL)

// Interceptor para agregar token a las requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en respuesta:", error)
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verificar si hay un usuario autenticado al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      const savedUser = localStorage.getItem("user")

      if (token && savedUser) {
        try {
          // Verificar que el token siga siendo válido
          const response = await axios.get("/auth/me")
          setUser(response.data.user)
        } catch (error) {
          console.error("Token inválido:", error)
          localStorage.removeItem("token")
          localStorage.removeItem("user")
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      console.log("Intentando login con:", { email, apiUrl: API_URL })
      const response = await axios.post("/auth/login", { email, password })
      const { token, user } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)

      toast.success("¡Bienvenido de vuelta!")
      return { success: true }
    } catch (error) {
      console.error("Error en login:", error)
      const message = error.response?.data?.message || "Error al iniciar sesión"
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    toast.success("Sesión cerrada correctamente")
  }

  const register = async (userData) => {
    try {
      console.log("Intentando registro con:", { userData, apiUrl: API_URL })
      const response = await axios.post("/auth/register", userData)
      const { token, user } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)

      toast.success("¡Cuenta creada exitosamente!")
      return { success: true }
    } catch (error) {
      console.error("Error en registro:", error)
      const message = error.response?.data?.message || "Error al crear cuenta"
      toast.error(message)
      return { success: false, message }
    }
  }

  const value = {
    user,
    login,
    logout,
    register,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
