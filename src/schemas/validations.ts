import { z } from "zod";
import { VALIDATION_RULES } from "../config/constants";
// Schema para Socio
export const socioSchema = z.object({
  cedula: z
    .string()
    .min(VALIDATION_RULES.CEDULA.MIN_LENGTH, "La cédula debe tener al menos 6 dígitos")
    .max(VALIDATION_RULES.CEDULA.MAX_LENGTH, "La cédula no puede tener más de 10 dígitos")
    .regex(VALIDATION_RULES.CEDULA.PATTERN, "La cédula debe contener solo números"),
  nombres: z
    .string()
    .min(2, "Los nombres deben tener al menos 2 caracteres")
    .max(50, "Los nombres no pueden exceder 50 caracteres"),
  apellidos: z
    .string()
    .min(2, "Los apellidos deben tener al menos 2 caracteres")
    .max(50, "Los apellidos no pueden exceder 50 caracteres"),
  correo: z
    .string()
    .email("Debe ser un correo electrónico válido")
    .optional()
    .or(z.literal("")),
  telefono: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 dígitos")
    .max(15, "El teléfono no puede tener más de 15 dígitos")
    .optional()
    .or(z.literal("")),
  direccion: z
    .string()
    .max(200, "La dirección no puede exceder 200 caracteres")
    .optional()
    .or(z.literal("")),
  fechaNacimiento: z.string().optional().or(z.literal("")),
  ciudad: z
    .string()
    .max(50, "La ciudad no puede exceder 50 caracteres")
    .optional()
    .or(z.literal("")),
  estado: z.enum(["Activo", "Inactivo", "Suspendido"]),
  observaciones: z
    .string()
    .max(500, "Las observaciones no pueden exceder 500 caracteres")
    .optional()
    .or(z.literal("")),
});

// Schema para Cuenta de Ahorro
export const cuentaAhorroSchema = z.object({
  idSocio: z.number().min(1, "Debe seleccionar un socio"),
  numeroCuenta: z
    .string()
    .min(6, "El número de cuenta debe tener al menos 6 caracteres")
    .max(20, "El número de cuenta no puede exceder 20 caracteres")
    .optional()
    .or(z.literal("")),
  tipoCuenta: z.enum(["Ahorro", "Corriente", "Especial"]),
  saldoActual: z.number().min(0, "El saldo no puede ser negativo").optional(),
  tasaInteres: z
    .number()
    .min(0, "La tasa de interés no puede ser negativa")
    .max(100, "La tasa de interés no puede exceder 100%")
    .optional(),
  montoMinimo: z
    .number()
    .min(0, "El monto mínimo no puede ser negativo")
    .optional(),
  estado: z.enum(["Activa", "Inactiva", "Suspendida", "Cerrada"]).optional(),
  observaciones: z
    .string()
    .max(500, "Las observaciones no pueden exceder 500 caracteres")
    .optional()
    .or(z.literal("")),
});

// Schema para Movimiento de Ahorro
export const movimientoSchema = z.object({
  idCuentaAhorro: z.number().min(1, "Debe seleccionar una cuenta"),
  tipoMovimiento: z.enum(["Deposito", "Retiro", "Transferencia", "Interes"]),
  monto: z.number().min(0.01, "El monto debe ser mayor a 0"),
  descripcion: z
    .string()
    .min(1, "La descripción es requerida")
    .max(200, "La descripción no puede exceder 200 caracteres"),
  numeroComprobante: z
    .string()
    .max(50, "El número de comprobante no puede exceder 50 caracteres")
    .optional()
    .or(z.literal("")),
});

// Schema para Aportación
export const aportacionSchema = z.object({
  idSocio: z.number().min(1, "Debe seleccionar un socio"),
  idTipoAportacion: z.number().min(1, "Debe seleccionar un tipo de aportación"),
  monto: z.number().min(0.01, "El monto debe ser mayor a 0"),
  fechaAportacion: z.string().min(1, "La fecha de aportación es requerida"),
  metodoPago: z.enum(["Efectivo", "Transferencia", "Cheque", "Tarjeta", "PSE"]),
  numeroComprobante: z
    .string()
    .max(50, "El número de comprobante no puede exceder 50 caracteres")
    .optional()
    .or(z.literal("")),
  motivo: z
    .string()
    .max(200, "El motivo no puede exceder 200 caracteres")
    .optional()
    .or(z.literal("")),
  observaciones: z
    .string()
    .max(500, "Las observaciones no pueden exceder 500 caracteres")
    .optional()
    .or(z.literal("")),
});

// Schema para Usuario
export const usuarioSchema = z.object({
  cedula: z
    .string()
    .min(6, "La cédula debe tener al menos 6 dígitos")
    .max(10, "La cédula no puede tener más de 10 dígitos"),
  nombres: z
    .string()
    .min(2, "Los nombres deben tener al menos 2 caracteres")
    .max(50, "Los nombres no pueden exceder 50 caracteres"),
  apellidos: z
    .string()
    .min(2, "Los apellidos deben tener al menos 2 caracteres")
    .max(50, "Los apellidos no pueden exceder 50 caracteres"),
  correo: z.string().email("Debe ser un correo electrónico válido"),
  telefono: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 dígitos")
    .max(15, "El teléfono no puede tener más de 15 dígitos")
    .optional()
    .or(z.literal("")),
  rol: z.enum(["Administrador", "Cajero", "Consulta"]).default("Consulta"),
  estado: z.enum(["Activo", "Inactivo"]).default("Activo"),
});

// Tipos derivados de los schemas
export type SocioFormData = z.infer<typeof socioSchema>;
export type CuentaAhorroFormData = z.infer<typeof cuentaAhorroSchema>;
export type MovimientoFormData = z.infer<typeof movimientoSchema>;
export type AportacionFormData = z.infer<typeof aportacionSchema>;
export type UsuarioFormData = z.infer<typeof usuarioSchema>;

export default {
  socioSchema,
  cuentaAhorroSchema,
  movimientoSchema,
  aportacionSchema,
  usuarioSchema,
};
