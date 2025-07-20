import { useState } from "react";
import {
  Card,
  Button,
  LoadingSpinner,
  Alert,
  Input,
  Select,
} from "../components/ui";
import { useCuentasAhorro, useSocios } from "../hooks/useApi";
import { Plus, Search, Edit, Trash2, Eye, CreditCard } from "lucide-react";
import type { CuentasAhorro, Socio } from "../types/api";

export default function CuentasAhorroPage() {
  const {
    data: cuentas,
    loading: cuentasLoading,
    error: cuentasError,
    refetch,
  } = useCuentasAhorro();
  const { data: socios, loading: sociosLoading } = useSocios();
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loading = cuentasLoading || sociosLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-gray-600">Cargando cuentas...</span>
      </div>
    );
  }

  if (cuentasError) {
    return (
      <Alert type="error" title="Error al cargar cuentas">
        {cuentasError}
      </Alert>
    );
  }

  const cuentasArray = Array.isArray(cuentas) ? cuentas : [];
  const sociosArray = Array.isArray(socios) ? socios : [];

  const filteredCuentas = cuentasArray.filter((cuenta: CuentasAhorro) => {
    const matchesSearch =
      cuenta.numeroCuenta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cuenta.tipoCuenta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cuenta.idSocioNavigation?.nombres
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      cuenta.idSocioNavigation?.apellidos
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesEstado = !estadoFilter || cuenta.estado === estadoFilter;

    return matchesSearch && matchesEstado;
  });

  const estadosOptions = [
    { value: "", label: "Todos los estados" },
    { value: "Activa", label: "Activa" },
    { value: "Inactiva", label: "Inactiva" },
    { value: "Suspendida", label: "Suspendida" },
    { value: "Cerrada", label: "Cerrada" },
  ];

  const sociosOptions = sociosArray.map((socio: Socio) => ({
    value: socio.idSocio.toString(),
    label: `${socio.nombres} ${socio.apellidos} - ${socio.cedula}`,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Cuentas de Ahorro
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Administra las cuentas de ahorro de los socios
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Cuenta
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por número de cuenta, tipo o socio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            options={estadosOptions}
          />
          <Button variant="secondary" onClick={refetch}>
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cuentas</p>
              <p className="text-2xl font-bold text-gray-900">
                {cuentasArray.length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">A</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Activas</p>
              <p className="text-2xl font-bold text-green-600">
                {cuentasArray.filter((c) => c.estado === "Activa").length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-bold">I</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactivas</p>
              <p className="text-2xl font-bold text-red-600">
                {cuentasArray.filter((c) => c.estado === "Inactiva").length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold">$</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Saldo Total</p>
              <p className="text-xl font-bold text-purple-600">
                {cuentasArray
                  .reduce(
                    (total, cuenta) => total + (cuenta.saldoActual || 0),
                    0
                  )
                  .toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Results */}
      <Card title={`Cuentas (${filteredCuentas.length})`}>
        {filteredCuentas.length > 0 ? (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número Cuenta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Socio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo Actual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Apertura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCuentas.map((cuenta: CuentasAhorro) => (
                  <tr key={cuenta.idCuentaAhorro} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {cuenta.numeroCuenta || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {cuenta.idSocioNavigation
                    ? `${cuenta.idSocioNavigation.nombres} ${cuenta.idSocioNavigation.apellidos}`
                    : "Socio no encontrado"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {cuenta.tipoCuenta || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {(cuenta.saldoActual || 0).toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      cuenta.estado === "Activa"
                        ? "bg-green-100 text-green-800"
                        : cuenta.estado === "Inactiva"
                        ? "bg-red-100 text-red-800"
                        : cuenta.estado === "Suspendida"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {cuenta.estado || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {cuenta.fechaApertura
                    ? new Date(cuenta.fechaApertura).toLocaleDateString("es-CO")
                    : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="secondary">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="danger">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No hay cuentas
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || estadoFilter
                ? "No se encontraron cuentas que coincidan con los filtros."
                : "Comienza creando una nueva cuenta de ahorro."}
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
                Crear Nueva Cuenta de Ahorro
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
                label="Socio"
                options={[
                  { value: "", label: "Seleccione un socio" },
                  ...sociosOptions,
                ]}
              />
              <Input
                label="Número de Cuenta"
                placeholder="Ingrese el número de cuenta"
              />
              <Select
                label="Tipo de Cuenta"
                options={[
                  { value: "", label: "Seleccione el tipo" },
                  { value: "Ahorro", label: "Ahorro" },
                  { value: "Corriente", label: "Corriente" },
                  { value: "Especial", label: "Especial" },
                ]}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Saldo Inicial" type="number" placeholder="0.00" />
                <Input
                  label="Tasa de Interés (%)"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              <Input label="Monto Mínimo" type="number" placeholder="0.00" />
              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </Button>
                <Button>Crear Cuenta</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
