const { z } = require('zod');

const estadosValidos = ['Programado', 'En tránsito', 'Entregado', 'Cancelado'];
const combustiblesValidos = ['Diésel', 'Nafta Super', 'Nafta Premium', 'GNC', 'GLP'];

const viajeSchema = z.object({
  camion: z
    .string()
    .min(6, 'La patente debe tener al menos 6 caracteres')
    .max(8, 'La patente no puede tener más de 8 caracteres')
    .regex(/^[A-Z0-9]+$/, 'La patente solo puede contener letras mayúsculas y números'),
  conductor: z
    .string()
    .min(2, 'El nombre del conductor debe tener al menos 2 caracteres')
    .trim(),
  origen: z
    .string()
    .min(2, 'El origen debe tener al menos 2 caracteres')
    .trim(),
  destino: z
    .string()
    .min(2, 'El destino debe tener al menos 2 caracteres')
    .trim(),
  combustible: z
    .enum(combustiblesValidos, {
      errorMap: () => ({ message: 'Tipo de combustible inválido' }),
    }),
  cantidad_litros: z
    .number()
    .int()
    .min(1, 'La cantidad debe ser mayor a 0')
    .max(30000, 'La cantidad no puede exceder los 30,000 litros'),
  fecha_salida: z
    .string()
    .datetime()
    .refine((date) => new Date(date) > new Date(), {
      message: 'La fecha de salida no puede ser en el pasado',
    }),
  observaciones: z
    .string()
    .max(500, 'Las observaciones no pueden exceder 500 caracteres')
    .trim()
    .optional(),
  estado: z
    .enum(estadosValidos, {
      errorMap: () => ({ message: 'Estado inválido' }),
    })
    .optional(),
});

const viajeQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .optional()
    .default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .default(10),
  estado: z
    .enum(estadosValidos)
    .optional(),
  combustible: z
    .enum(combustiblesValidos)
    .optional(),
  conductor: z
    .string()
    .trim()
    .optional(),
  sortBy: z
    .enum(['fecha_salida', 'conductor', 'estado', 'cantidad_litros', 'camion', 'combustible'])
    .optional()
    .default('fecha_salida'),
  sortOrder: z
    .enum(['asc', 'desc'])
    .optional()
    .default('desc'),
  excludeStatus: z
    .string()
    .optional(),
  showCanceled: z
    .boolean()
    .optional()
    .default(false),
});

module.exports = {
  viajeSchema,
  viajeQuerySchema,
  estadosValidos,
  combustiblesValidos,
};