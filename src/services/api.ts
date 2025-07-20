// En desarrollo, usar el proxy de Vite (ruta relativa)
// En producción, usar la URL completa del backend
const API_BASE_URL = import.meta.env.DEV ? "" : "https://localhost:7006";

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Generic CRUD methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // Socios endpoints
  async getSocios() {
    return this.get("/api/Socio");
  }

  async getSocioById(id: number) {
    return this.get(`/api/Socio/${id}`);
  }

  async createSocio(socio: any) {
    return this.post("/api/Socio", socio);
  }

  async updateSocio(id: number, socio: any) {
    return this.put(`/api/Socio/${id}`, socio);
  }

  async deleteSocio(id: number) {
    return this.delete(`/api/Socio/${id}`);
  }

  // Cuentas de Ahorro endpoints
  async getCuentasAhorro() {
    return this.get("/api/CuentasAhorro");
  }

  async getCuentaAhorroById(id: number) {
    return this.get(`/api/CuentasAhorro/${id}`);
  }

  async getCuentasBySocio(idSocio: number) {
    return this.get(`/api/CuentasAhorro/socio/${idSocio}`);
  }

  async getCuentasByEstado(estado: string) {
    return this.get(`/api/CuentasAhorro/estado/${estado}`);
  }

  async getResumenCuenta(cedula: string, numeroCuenta: string) {
    return this.get(`/api/CuentasAhorro/resumen/${cedula}/${numeroCuenta}`);
  }

  async createCuentaAhorro(cuenta: any) {
    return this.post("/api/CuentasAhorro", cuenta);
  }

  async updateCuentaAhorro(id: number, cuenta: any) {
    return this.put(`/api/CuentasAhorro/${id}`, cuenta);
  }

  async deleteCuentaAhorro(id: number) {
    return this.delete(`/api/CuentasAhorro/${id}`);
  }

  // Movimientos de Ahorro endpoints
  async getMovimientosAhorro() {
    return this.get("/api/MovimientosAhorro");
  }

  async getMovimientoById(id: number) {
    return this.get(`/api/MovimientosAhorro/${id}`);
  }

  async getMovimientosByCuenta(idCuenta: number) {
    return this.get(`/api/MovimientosAhorro/cuenta/${idCuenta}`);
  }

  async getMovimientosByTipo(tipo: string) {
    return this.get(`/api/MovimientosAhorro/tipo/${tipo}`);
  }

  async getMovimientosByFecha(fechaInicio: string, fechaFin: string) {
    return this.get(`/api/MovimientosAhorro/fecha/${fechaInicio}/${fechaFin}`);
  }

  async createMovimiento(movimiento: any) {
    return this.post("/api/MovimientosAhorro", movimiento);
  }

  async deleteMovimiento(id: number) {
    return this.delete(`/api/MovimientosAhorro/${id}`);
  }

  // Aportaciones endpoints
  async getAportaciones() {
    return this.get("/api/Aportaciones");
  }

  async getAportacionById(id: number) {
    return this.get(`/api/Aportaciones/${id}`);
  }

  async getAportacionesBySocio(idSocio: number) {
    return this.get(`/api/Aportaciones/socio/${idSocio}`);
  }

  async getAportacionesByEstado(estado: string) {
    return this.get(`/api/Aportaciones/estado/${estado}`);
  }

  async createAportacion(aportacion: any) {
    return this.post("/api/Aportaciones", aportacion);
  }

  async updateAportacion(id: number, aportacion: any) {
    return this.put(`/api/Aportaciones/${id}`, aportacion);
  }

  async deleteAportacion(id: number) {
    return this.delete(`/api/Aportaciones/${id}`);
  }

  // Créditos endpoints
  async getPagosCredito() {
    return this.get("/api/PagosCredito");
  }

  async getPagoCreditoById(id: number) {
    return this.get(`/api/PagosCredito/${id}`);
  }

  async getPagosByCredito(idCredito: number) {
    return this.get(`/api/PagosCredito/credito/${idCredito}`);
  }

  async getPagosByEstado(estado: string) {
    return this.get(`/api/PagosCredito/estado/${estado}`);
  }

  async getPagosByFecha(fechaInicio: string, fechaFin: string) {
    return this.get(`/api/PagosCredito/fecha/${fechaInicio}/${fechaFin}`);
  }

  async createPagoCredito(pago: any) {
    return this.post("/api/PagosCredito", pago);
  }

  // Usuarios endpoints
  async getUsuarios() {
    return this.get("/api/Usuarios");
  }

  async getUsuarioById(id: number) {
    return this.get(`/api/Usuarios/${id}`);
  }

  async createUsuario(usuario: any) {
    return this.post("/api/Usuarios", usuario);
  }

  async updateUsuario(id: number, usuario: any) {
    return this.put(`/api/Usuarios/${id}`, usuario);
  }

  async deleteUsuario(id: number) {
    return this.delete(`/api/Usuarios/${id}`);
  }

  // Parámetros Generales endpoints
  async getParametros() {
    return this.get("/api/ParametrosGenerale");
  }

  async getParametroById(id: number) {
    return this.get(`/api/ParametrosGenerale/${id}`);
  }

  async createParametro(parametro: any) {
    return this.post("/api/ParametrosGenerale", parametro);
  }

  async updateParametro(id: number, parametro: any) {
    return this.put(`/api/ParametrosGenerale/${id}`, parametro);
  }

  async deleteParametro(id: number) {
    return this.delete(`/api/ParametrosGenerale/${id}`);
  }

  // Plan de Cuentas endpoints
  async getPlanCuentas() {
    return this.get("/api/PlanCuenta");
  }

  async getPlanCuentaById(id: number) {
    return this.get(`/api/PlanCuenta/${id}`);
  }

  async createPlanCuenta(cuenta: any) {
    return this.post("/api/PlanCuenta", cuenta);
  }

  async updatePlanCuenta(id: number, cuenta: any) {
    return this.put(`/api/PlanCuenta/${id}`, cuenta);
  }

  async deletePlanCuenta(id: number) {
    return this.delete(`/api/PlanCuenta/${id}`);
  }

  // Libro Diario endpoints
  async getLibroDiario() {
    return this.get("/api/LibroDiario");
  }

  async getAsientoById(id: number) {
    return this.get(`/api/LibroDiario/${id}`);
  }

  async getAsientosByFecha(fechaInicio: string, fechaFin: string) {
    return this.get(`/api/LibroDiario/fecha/${fechaInicio}/${fechaFin}`);
  }

  async getAsientosByCuenta(idCuenta: number) {
    return this.get(`/api/LibroDiario/cuenta/${idCuenta}`);
  }

  async getAsientosByEstado(estado: string) {
    return this.get(`/api/LibroDiario/estado/${estado}`);
  }

  async createAsiento(asiento: any) {
    return this.post("/api/LibroDiario", asiento);
  }

  // Historial de Acciones endpoints
  async getHistorialAcciones() {
    return this.get("/api/HistorialAccione");
  }

  async getHistorialById(id: number) {
    return this.get(`/api/HistorialAccione/${id}`);
  }

  async createHistorial(historial: any) {
    return this.post("/api/HistorialAccione", historial);
  }

  async updateHistorial(id: number, historial: any) {
    return this.put(`/api/HistorialAccione/${id}`, historial);
  }

  async deleteHistorial(id: number) {
    return this.delete(`/api/HistorialAccione/${id}`);
  }
}

export const apiService = new ApiService();
export default apiService;
