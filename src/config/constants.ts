// Configuración de la aplicación
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5175",
  TIMEOUT: 30000,
};

// Configuración de paginación
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
};


// Número predeterminado de elementos por página para paginación
export const DEFAULT_PAGE_SIZE = 10;


// Estados de entidades
export const ESTADOS = {
  SOCIO: {
    ACTIVO: "Activo",
    INACTIVO: "Inactivo",
    SUSPENDIDO: "Suspendido",
  },
  CUENTA: {
    ACTIVA: "Activa",
    INACTIVA: "Inactiva",
    SUSPENDIDA: "Suspendida",
    CERRADA: "Cerrada",
  },
  APORTACION: {
    APROBADA: "Aprobada",
    PENDIENTE: "Pendiente",
    RECHAZADA: "Rechazada",
  },
  CREDITO: {
    APROBADO: "Aprobado",
    DESEMBOLSADO: "Desembolsado",
    PAGADO: "Pagado",
    VENCIDO: "Vencido",
    CANCELADO: "Cancelado",
  },
};

// Tipos de movimientos
export const TIPOS_MOVIMIENTO = {
  DEPOSITO: "Deposito",
  RETIRO: "Retiro",
  TRANSFERENCIA: "Transferencia",
  INTERES: "Interes",
};

// Métodos de pago
export const METODOS_PAGO = {
  EFECTIVO: "Efectivo",
  TRANSFERENCIA: "Transferencia",
  CHEQUE: "Cheque",
  TARJETA: "Tarjeta",
};

// Tipos de cuenta
export const TIPOS_CUENTA = {
  AHORRO: "Ahorro",
  CORRIENTE: "Corriente",
  ESPECIAL: "Especial",
};

// Formatos de fecha
export const DATE_FORMATS = {
  DISPLAY: "dd/MM/yyyy",
  INPUT: "yyyy-MM-dd",
  DATETIME: "dd/MM/yyyy HH:mm",
};

// Configuración de moneda
export const CURRENCY_CONFIG = {
  LOCALE: "es-CO",
  CURRENCY: "COP",
  MINIMUM_FRACTION_DIGITS: 0,
  MAXIMUM_FRACTION_DIGITS: 2,
};

// Mensajes de la aplicación
export const MESSAGES = {
  ERRORS: {
    NETWORK: "Error de conexión. Por favor, verifica tu conexión a internet.",
    UNAUTHORIZED: "No tienes permisos para realizar esta acción.",
    NOT_FOUND: "El recurso solicitado no fue encontrado.",
    SERVER_ERROR: "Error interno del servidor. Por favor, intenta más tarde.",
    VALIDATION: "Por favor, verifica los datos ingresados.",
  },
  SUCCESS: {
    CREATED: "Registro creado exitosamente.",
    UPDATED: "Registro actualizado exitosamente.",
    DELETED: "Registro eliminado exitosamente.",
  },
  LOADING: {
    DEFAULT: "Cargando...",
    SAVING: "Guardando...",
    DELETING: "Eliminando...",
  },
  CONFIRMATIONS: {
    DELETE: "¿Estás seguro de que deseas eliminar este registro?",
    LOGOUT: "¿Estás seguro de que deseas cerrar sesión?",
  },
};

// Validaciones
export const VALIDATION_RULES = {
  CEDULA: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 10,
    PATTERN: /^\d+$/,
  },
  TELEFONO: {
    MIN_LENGTH: 7,
    MAX_LENGTH: 15,
    PATTERN: /^[\d\s\-\+\(\)]+$/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  MONTO: {
    MIN: 0,
    MAX: 999999999.99,
  },
};

// URLs de navegación
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/",
  SOCIOS: "/socios",
  CUENTAS_AHORRO: "/cuentas-ahorro",
  MOVIMIENTOS: "/movimientos",
  APORTACIONES: "/aportaciones",
  CREDITOS: "/creditos",
  CONFIGURACION: "/configuracion",
};

export default {
  API_CONFIG,
  PAGINATION_CONFIG,
  ESTADOS,
  TIPOS_MOVIMIENTO,
  METODOS_PAGO,
  TIPOS_CUENTA,
  DATE_FORMATS,
  CURRENCY_CONFIG,
  MESSAGES,
  VALIDATION_RULES,
  ROUTES,
};
