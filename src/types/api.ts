export interface Socio {
  idSocio: number;
  numeroSocio?: string;
  cedula?: string;
  nombres?: string;
  apellidos?: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: string;
  ciudad?: string;
  fechaIngreso: string;
  estado?: string;
  fechaCreacion?: string;
  observaciones?: string;
}

export interface CuentasAhorro {
  idCuentaAhorro: number;
  idSocio: number;
  numeroCuenta?: string;
  tipoCuenta?: string;
  saldoActual?: number;
  tasaInteres?: number;
  fechaApertura: string;
  estado?: string;
  montoMinimo?: number;
  fechaUltimoMovimiento?: string;
  idSocioNavigation?: Socio;
}

export interface MovimientosAhorro {
  idMovimiento: number;
  idCuentaAhorro: number;
  tipoMovimiento?: string;
  monto: number;
  saldoAnterior: number;
  saldoNuevo: number;
  descripcion?: string;
  fechaMovimiento?: string;
  numeroComprobante?: string;
  usuarioRegistro: number;
  idCuentaContable?: number;
}

export interface Aportacione {
  idAportacion: number;
  idSocio: number;
  idTipoAportacion: number;
  numeroComprobante?: string;
  monto: number;
  fechaAportacion: string;
  motivo?: string;
  metodoPago?: string;
  estado?: string;
  usuarioRegistro: number;
  fechaRegistro?: string;
  observaciones?: string;
}

export interface TiposAportacion {
  idTipoAportacion: number;
  nombreTipo?: string;
  descripcion?: string;
  montoMinimo?: number;
  esObligatoria?: boolean;
  frecuencia?: string;
  estado?: string;
}

export interface Credito {
  idCredito: number;
  idSolicitud: number;
  idSocio: number;
  numeroCredito?: string;
  montoAprobado: number;
  tasaInteres: number;
  plazoMeses: number;
  cuotaMensual: number;
  saldoCapital: number;
  fechaAprobacion: string;
  fechaDesembolso?: string;
  fechaVencimiento: string;
  estado?: string;
  usuarioAprobacion: number;
}

export interface SolicitudesCredito {
  idSolicitud: number;
  idSocio: number;
  montoSolicitado: number;
  plazoMeses: number;
  tasaInteres: number;
  destinoCredito?: string;
  ingresosMensuales?: number;
  gastosMensuales?: number;
  fechaSolicitud: string;
  estado?: string;
  motivoRechazo?: string;
  usuarioEvaluador?: number;
  fechaEvaluacion?: string;
  observaciones?: string;
}

export interface PagosCredito {
  idPago: number;
  idCredito: number;
  idCuota?: number;
  estado?: string;
  montoPago: number;
  montoCapital: number;
  montoInteres: number;
  montoMora?: number;
  fechaPago: string;
  metodoPago?: string;
  numeroComprobante?: string;
  usuarioRegistro: number;
  observaciones?: string;
}

export interface TablaAmortizacion {
  idCuota: number;
  idCredito: number;
  numeroCuota: number;
  fechaVencimiento: string;
  cuotaCapital: number;
  cuotaInteres: number;
  cuotaTotal: number;
  saldoPendiente: number;
  estado?: string;
}

export interface Usuario {
  idUsuario: number;
  cedula?: string;
  nombres?: string;
  apellidos?: string;
  correo?: string;
  telefono?: string;
  rol?: string;
  estado?: string;
  fechaCreacion?: string;
  ultimoAcceso?: string;
}

export interface ParametrosGenerale {
  idParametro: number;
  nombreParametro?: string;
  valorParametro?: string;
  descripcion?: string;
  tipoDato?: string;
  modulo?: string;
  fechaActualizacion?: string;
  usuarioActualizacion?: number;
}

export interface PlanCuenta {
  idCuenta: number;
  codigoCuenta?: string;
  nombreCategoria?: string;
  descripcion?: string;
  tipoCuenta?: string;
  cuentaPadre?: number;
  nivel?: number;
  valorMonetario?: number;
  estado?: string;
  fechaCreacion?: string;
}

export interface LibroDiario {
  idAsiento: number;
  numeroAsiento?: string;
  fechaAsiento: string;
  concepto?: string;
  totalDebe: number;
  totalHaber: number;
  usuarioRegistro: number;
  fechaRegistro?: string;
  estado?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
