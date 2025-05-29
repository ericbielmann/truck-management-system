const mongoose = require("mongoose")
const User = require("../models/User")
require("dotenv").config()

async function createDemoUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/truck_management")
    console.log("✅ Conectado a MongoDB")

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: "admin@demo.com" })
    if (existingUser) {
      console.log("👤 Usuario demo ya existe")
      return
    }

    // Create demo user
    const demoUser = new User({
      email: "admin@demo.com",
      password: "123456",
      nombre: "Administrador Demo",
      rol: "admin",
    })

    await demoUser.save()
    console.log("✅ Usuario demo creado exitosamente")
    console.log("📧 Email: admin@demo.com")
    console.log("🔑 Password: 123456")
  } catch (error) {
    console.error("❌ Error creando usuario demo:", error)
  } finally {
    await mongoose.disconnect()
    console.log("🔌 Desconectado de MongoDB")
  }
}

createDemoUser()
