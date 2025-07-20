import { useState } from "react";
import {
  Card,
  Button,
  LoadingSpinner,
  Alert,
  Input,
  Select,
} from "../components/ui";
import { useApi, useCuentasAhorro } from "../hooks/useApi";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { apiService } from "../services/api";
import type { MovimientosAhorro, CuentasAhorro } from "../types/api";

export default function Movimientos() {
  const {
    data: movimientos,
    loading: movimientosLoading,
    error: movimientosError,
    refetch,
  } = useApi(() => apiService.getMovimientosAhorro());
  const { data: cuentas, loading: cuentasLoading } = useCuentasAhorro();

  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [cuentaFilter, setCuentaFilter] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loading = movimientosLoading || cuentasLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-gray-600">Cargando movimientos...</span>
      </div>
    );
  }

  if (movimientosError) {
    return (
      <Alert type="error" title="Error al cargar movimientos">
        {movimientosError}
      </Alert>
    );
  }

  const movimientosArray = Array.isArray(movimientos) ? movimientos : [];
  const cuentasArray = Array.isArray(cuentas) ? cuentas : [];

  const filteredMovimientos = movimientosArray.filter(
    (movimiento: MovimientosAhorro) => {
      const matchesSearch =
        movimiento.descripcion
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        movimiento.numeroComprobante?.includes(searchTerm) ||
        movimiento.monto.toString().includes(searchTerm);

      const matchesTipo =
        !tipoFilter || movimiento.tipoMovimiento === tipoFilter;
      const matchesCuenta =
        !cuentaFilter || movimiento.idCuentaAhorro.toString() === cuentaFilter;

      let matchesFecha = true;
      if (fechaInicio || fechaFin) {
        const fechaMovimiento = new Date(movimiento.fechaMovimiento || "");
        const inicio = fechaInicio ? new Date(fechaInicio) : null;
        const fin = fechaFin ? new Date(fechaFin) : null;

        if (inicio && fechaMovimiento < inicio) matchesFecha = false;
        if (fin && fechaMovimiento > fin) matchesFecha = false;
      }

      return matchesSearch && matchesTipo && matchesCuenta && matchesFecha;
    }
  );

  const tiposOptions = [
    { value: "", label: "Todos los tipos" },
    { value: "Deposito", label: "Depósito" },
    { value: "Retiro", label: "Retiro" },
    { value: "Transferencia", label: "Transferencia" },
    { value: "Interes", label: "Interés" },
  ];

  const cuentasOptions = [
    { value: "", label: "Todas las cuentas" },
    ...cuentasArray.map((cuenta: CuentasAhorro) => ({
      value: cuenta.idCuentaAhorro.toString(),
      label: `${cuenta.numeroCuenta} - ${cuenta.idSocioNavigation?.nombres} ${cuenta.idSocioNavigation?.apellidos}`,
    })),
  ];

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "Deposito":
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      case "Retiro":
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      default:
        return <ArrowUpDown className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "Deposito":
        return "bg-green-100 text-green-800";
      case "Retiro":
        return "bg-red-100 text-red-800";
      case "Transferencia":
        return "bg-blue-100 text-blue-800";
      case "Interes":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalDepositos = movimientosArray
    .filter((m) => m.tipoMovimiento === "Deposito")
    .reduce((sum, m) => sum + m.monto, 0);

  const totalRetiros = movimientosArray
    .filter((m) => m.tipoMovimiento === "Retiro")
    .reduce((sum, m) => sum + m.monto, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Movimientos de Ahorro
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Registro de todos los movimientos en las cuentas de ahorro
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Movimiento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <ArrowUpDown className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Movimientos
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {movimientosArray.length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <ArrowDown className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Depósitos
              </p>
              <p className="text-xl font-bold text-green-600">
                {totalDepositos.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                })}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <ArrowUp className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Retiros</p>
              <p className="text-xl font-bold text-red-600">
                {totalRetiros.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                })}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold">Δ</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Balance</p>
              <p
                className={`text-xl font-bold ${
                  totalDepositos - totalRetiros >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {(totalDepositos - totalRetiros).toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                })}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar movimientos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            options={tiposOptions}
          />
          <Select
            value={cuentaFilter}
            onChange={(e) => setCuentaFilter(e.target.value)}
            options={cuentasOptions}
          />
          <Input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            placeholder="Fecha inicio"
          />
          <Input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            placeholder="Fecha fin"
          />
          <Button variant="secondary" onClick={refetch}>
            <Filter className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Results */}
      <Card title={`Movimientos (${filteredMovimientos.length})`}>
        {filteredMovimientos.length > 0 ? (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cuenta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo Nuevo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comprobante
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMovimientos
                  .sort(
                    (a, b) =>
                      new Date(b.fechaMovimiento || "").getTime() -
                      new Date(a.fechaMovimiento || "").getTime()
                  )
              .map((movimiento: MovimientosAhorro) => {
                const cuenta = cuentasArray.find(
                  (c) => c.idCuentaAhorro === movimiento.idCuentaAhorro
                );
                return (
                  <tr key={movimiento.idMovimiento}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {movimiento.fechaMovimiento
                        ? new Date(
                            movimiento.fechaMovimiento
                          ).toLocaleDateString("es-CO")
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTipoIcon(movimiento.tipoMovimiento || "")}
                        <span
                          className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTipoColor(
                            movimiento.tipoMovimiento || ""
                          )}`}
                        >
                          {movimiento.tipoMovimiento || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">
                          {cuenta?.numeroCuenta || "N/A"}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {cuenta?.idSocioNavigation
                            ? `${cuenta.idSocioNavigation.nombres} ${cuenta.idSocioNavigation.apellidos}`
                            : "Socio no encontrado"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {movimiento.descripcion || "Sin descripción"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span
                        className={`${
                          movimiento.tipoMovimiento === "Deposito"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {movimiento.tipoMovimiento === "Retiro" ? "-" : "+"}
                        {movimiento.monto.toLocaleString("es-CO", {
                          style: "currency",
                          currency: "COP",
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {movimiento.saldoNuevo.toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {movimiento.numeroComprobante || "N/A"}
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <ArrowUpDown className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No hay movimientos
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ||
              tipoFilter ||
              cuentaFilter ||
              fechaInicio ||
              fechaFin
                ? "No se encontraron movimientos que coincidan con los filtros."
                : "No hay movimientos registrados."}
            </p>
          </div>
        )}
      </Card>

      {/* Create Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Registrar Nuevo Movimiento
              </h3>
              <Button
                variant="secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cerrar
              </Button>
            </div>
            <div className="space-y-4">
              <Select
                label="Cuenta"
                options={[
                  { value: "", label: "Seleccione una cuenta" },
                  ...cuentasOptions.slice(1),
                ]}
              />
              <Select
                label="Tipo de Movimiento"
                options={[
                  { value: "", label: "Seleccione el tipo" },
                  ...tiposOptions.slice(1),
                ]}
              />
              <Input
                label="Monto"
                type="number"
                step="0.01"
                placeholder="0.00"
              />
              <Input
                label="Descripción"
                placeholder="Descripción del movimiento"
              />
              <Input
                label="Número de Comprobante"
                placeholder="Número de comprobante (opcional)"
              />
              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </Button>
                <Button>Registrar Movimiento</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
