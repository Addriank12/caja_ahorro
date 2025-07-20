import { useState, useEffect } from "react";
import { apiService } from "../services/api";

export function useApi<T>(apiCall: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, deps);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

export function useSocios() {
  return useApi(() => apiService.getSocios());
}

export function useSocio(id: number | null) {
  return useApi(
    () => (id ? apiService.getSocioById(id) : Promise.resolve(null)),
    [id]
  );
}

export function useCuentasAhorro() {
  return useApi(() => apiService.getCuentasAhorro());
}

export function useCuentasBySocio(idSocio: number | null) {
  return useApi(
    () =>
      idSocio ? apiService.getCuentasBySocio(idSocio) : Promise.resolve([]),
    [idSocio]
  );
}

export function useMovimientosByCuenta(idCuenta: number | null) {
  return useApi(
    () =>
      idCuenta
        ? apiService.getMovimientosByCuenta(idCuenta)
        : Promise.resolve([]),
    [idCuenta]
  );
}

export function useAportaciones() {
  return useApi(() => apiService.getAportaciones());
}

export function useAportacionesBySocio(idSocio: number | null) {
  return useApi(
    () =>
      idSocio
        ? apiService.getAportacionesBySocio(idSocio)
        : Promise.resolve([]),
    [idSocio]
  );
}

export function usePagosCredito() {
  return useApi(() => apiService.getPagosCredito());
}

export function useUsuarios() {
  return useApi(() => apiService.getUsuarios());
}
