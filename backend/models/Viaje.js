const mongoose = require("mongoose")
const { v4: uuidv4 } = require("uuid")

const viajeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    camion: {
      type: String,
      required: [true, "La patente del camión es requerida"],
      trim: true,
      uppercase: true,
      match: [/^[A-Z0-9]{6,8}$/, "Formato de patente inválido"],
    },
    conductor: {
      type: String,
      required: [true, "El nombre del conductor es requerido"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
    },
    origen: {
      type: String,
      required: [true, "El origen es requerido"],
      trim: true,
    },
    destino: {
      type: String,
      required: [true, "El destino es requerido"],
      trim: true,
    },
    combustible: {
      type: String,
      required: [true, "El tipo de combustible es requerido"],
      enum: {
        values: ["Diésel", "Nafta Super", "Nafta Premium", "GNC", "GLP"],
        message: "Tipo de combustible no válido",
      },
    },
    cantidad_litros: {
      type: Number,
      required: [true, "La cantidad de litros es requerida"],
      min: [1, "La cantidad debe ser mayor a 0"],
      max: [30000, "La cantidad no puede exceder los 30,000 litros"],
    },
    fecha_salida: {
      type: Date,
      required: [true, "La fecha de salida es requerida"],
      validate: {
        validator: (value) => value >= new Date(),
        message: "La fecha de salida no puede ser en el pasado",
      },
    },
    estado: {
      type: String,
      enum: {
        values: ["Programado", "En tránsito", "Entregado", "Cancelado"],
        message: "Estado no válido",
      },
      default: "Programado",
    },
    fecha_entrega: {
      type: Date,
    },
    observaciones: {
      type: String,
      trim: true,
      maxlength: [500, "Las observaciones no pueden exceder 500 caracteres"],
    },
    creado_por: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Índices para mejorar performance
viajeSchema.index({ estado: 1 })
viajeSchema.index({ fecha_salida: 1 })
viajeSchema.index({ conductor: 1 })
viajeSchema.index({ combustible: 1 })

// Middleware para actualizar fecha_entrega cuando estado cambia a 'Entregado'
viajeSchema.pre("save", function (next) {
  if (this.isModified("estado") && this.estado === "Entregado" && !this.fecha_entrega) {
    this.fecha_entrega = new Date()
  }
  next()
})

module.exports = mongoose.model("Viaje", viajeSchema)
