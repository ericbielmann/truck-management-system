import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .trim(),
  rol: z
    .enum(['admin', 'operador'], {
      errorMap: () => ({ message: 'Rol inválido' }),
    }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'La contraseña es requerida'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;