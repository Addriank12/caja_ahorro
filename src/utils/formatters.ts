import { CURRENCY_CONFIG } from "../config/constants";

/**
 * Formatea un número como moneda colombiana
 */
export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) {
    return "$0";
  }

  return amount.toLocaleString(CURRENCY_CONFIG.LOCALE, {
    style: "currency",
    currency: CURRENCY_CONFIG.CURRENCY,
    minimumFractionDigits: CURRENCY_CONFIG.MINIMUM_FRACTION_DIGITS,
    maximumFractionDigits: CURRENCY_CONFIG.MAXIMUM_FRACTION_DIGITS,
  });
};

/**
 * Formatea una fecha para mostrar
 */
export const formatDate = (
  date: string | Date | null | undefined,
  includeTime = false
): string => {
  if (!date) {
    return "N/A";
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Fecha inválida";
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return dateObj.toLocaleDateString("es-CO", options);
};

/**
 * Formatea una fecha para input de tipo date
 */
export const formatDateForInput = (
  date: string | Date | null | undefined
): string => {
  if (!date) {
    return "";
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  return dateObj.toISOString().split("T")[0];
};

/**
 * Formatea un número de teléfono
 */
export const formatPhone = (phone: string | null | undefined): string => {
  if (!phone) {
    return "N/A";
  }

  // Remover todos los caracteres que no sean dígitos
  const cleaned = phone.replace(/\D/g, "");

  // Si tiene 10 dígitos, formatear como (xxx) xxx-xxxx
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  }

  // Si tiene 7 dígitos, formatear como xxx-xxxx
  if (cleaned.length === 7) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }

  // Si no coincide con formatos conocidos, devolver como está
  return phone;
};

/**
 * Formatea una cédula
 */
export const formatCedula = (cedula: string | null | undefined): string => {
  if (!cedula) {
    return "N/A";
  }

  // Remover puntos y comas existentes
  const cleaned = cedula.replace(/[.,]/g, "");

  // Formatear con puntos cada 3 dígitos desde la derecha
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

/**
 * Capitaliza la primera letra de cada palabra
 */
export const capitalizeWords = (text: string | null | undefined): string => {
  if (!text) {
    return "";
  }

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Trunca un texto si es muy largo
 */
export const truncateText = (
  text: string | null | undefined,
  maxLength = 50
): string => {
  if (!text) {
    return "";
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength - 3) + "...";
};

/**
 * Valida si una cédula es válida
 */
export const validateCedula = (cedula: string): boolean => {
  if (!cedula) return false;

  const cleaned = cedula.replace(/[.,]/g, "");
  return /^\d{6,10}$/.test(cleaned);
};

/**
 * Valida si un email es válido
 */
export const validateEmail = (email: string): boolean => {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida si un teléfono es válido
 */
export const validatePhone = (phone: string): boolean => {
  if (!phone) return false;

  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 7 && cleaned.length <= 15;
};

/**
 * Genera un número de cuenta aleatorio
 */
export const generateAccountNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${timestamp}${random}`;
};

/**
 * Genera un número de comprobante aleatorio
 */
export const generateReceiptNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  return `${year}${month}${day}${random}`;
};

/**
 * Calcula la edad basada en la fecha de nacimiento
 */
export const calculateAge = (birthDate: string | Date): number => {
  const birth = typeof birthDate === "string" ? new Date(birthDate) : birthDate;
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

/**
 * Debounce para búsquedas
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Obtiene las iniciales de un nombre
 */
export const getInitials = (name: string | null | undefined): string => {
  if (!name) return "??";

  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Formatea un número a dos decimales (sin símbolo monetario)
 */
export const formatearDecimal = (valor: number): string => {
  return valor.toFixed(2);
};


export default {
  formatCurrency,
  formatDate,
  formatDateForInput,
  formatPhone,
  formatCedula,
  capitalizeWords,
  truncateText,
  validateCedula,
  validateEmail,
  validatePhone,
  generateAccountNumber,
  generateReceiptNumber,
  calculateAge,
  debounce,
  getInitials,
};
