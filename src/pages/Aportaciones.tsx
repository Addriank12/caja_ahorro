import { useState } from "react";
import {
  Card,
  Button,
  Table,
  LoadingSpinner,
  Alert,
  Input,
  Select,
} from "../components/ui";
import { useAportaciones, useSocios, useApi } from "../hooks/useApi";
import {
  Plus,
  Search,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { apiService } from "../services/api";
import type { Aportacione, Socio, TiposAportacion } from "../types/api";

export default function Aportaciones() {
  const {
    data: aportaciones,
    loading: aportacionesLoading,
    error: aportacionesError,
    refetch,
  } = useAportaciones();
  const { data: socios, loading: sociosLoading } = useSocios();
  const { data: tiposAportacion, loading: tiposLoading } = useApi<
    TiposAportacion[]
  >(() => apiService.get("/api/TiposAportacion") as Promise<TiposAportacion[]>);

  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [socioFilter, setSocioFilter] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loading = aportacionesLoading || sociosLoading || tiposLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-gray-600">Cargando aportaciones...</span>
      </div>
    );
  }

  if (aportacionesError) {
    return (
      <Alert type="error" title="Error al cargar aportaciones">
        {aportacionesError}
      </Alert>
    );
  }

  const aportacionesArray = Array.isArray(aportaciones) ? aportaciones : [];
  const sociosArray = Array.isArray(socios) ? socios : [];
  const tiposArray = Array.isArray(tiposAportacion) ? tiposAportacion : [];

  const filteredAportaciones = aportacionesArray.filter(
    (aportacion: Aportacione) => {
      const socio = sociosArray.find(
        (s: Socio) => s.idSocio === aportacion.idSocio
      );

      const matchesSearch =
        socio?.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        socio?.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        socio?.cedula?.includes(searchTerm) ||
        aportacion.numeroComprobante?.includes(searchTerm) ||
        aportacion.monto.toString().includes(searchTerm);

      const matchesEstado = !estadoFilter || aportacion.estado === estadoFilter;
      const matchesTipo =
        !tipoFilter || aportacion.idTipoAportacion.toString() === tipoFilter;
      const matchesSocio =
        !socioFilter || aportacion.idSocio.toString() === socioFilter;

      let matchesFecha = true;
      if (fechaInicio || fechaFin) {
        const fechaAportacion = new Date(aportacion.fechaAportacion);
        const inicio = fechaInicio ? new Date(fechaInicio) : null;
        const fin = fechaFin ? new Date(fechaFin) : null;

        if (inicio && fechaAportacion < inicio) matchesFecha = false;
        if (fin && fechaAportacion > fin) matchesFecha = false;
      }

      return (
        matchesSearch &&
        matchesEstado &&
        matchesTipo &&
        matchesSocio &&
        matchesFecha
      );
    }
  );

  const estadosOptions = [
    { value: "", label: "Todos los estados" },
    { value: "Aprobada", label: "Aprobada" },
    { value: "Pendiente", label: "Pendiente" },
    { value: "Rechazada", label: "Rechazada" },
  ];

  const tiposOptions = [
    { value: "", label: "Todos los tipos" },
    ...tiposArray.map((tipo: TiposAportacion) => ({
      value: tipo.idTipoAportacion.toString(),
      label: tipo.nombreTipo || `Tipo ${tipo.idTipoAportacion}`,
    })),
  ];

  const sociosOptions = [
    { value: "", label: "Todos los socios" },
    ...sociosArray.map((socio: Socio) => ({
      value: socio.idSocio.toString(),
      label: `${socio.nombres} ${socio.apellidos} - ${socio.cedula}`,
    })),
  ];

  const totalAportaciones = aportacionesArray
    .filter((a) => a.estado === "Aprobada")
    .reduce((sum, a) => sum + a.monto, 0);

  const aportacionesPendientes = aportacionesArray.filter(
    (a) => a.estado === "Pendiente"
  ).length;

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Aprobada":
        return "bg-green-100 text-green-800";
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "Rechazada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aportaciones</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestión de aportaciones de los socios
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Aportación
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Aportaciones
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {aportacionesArray.length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monto Total</p>
              <p className="text-xl font-bold text-green-600">
                {totalAportaciones.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                })}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {aportacionesPendientes}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aprobadas</p>
              <p className="text-2xl font-bold text-purple-600">
                {
                  aportacionesArray.filter((a) => a.estado === "Aprobada")
                    .length
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar aportaciones..."
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
          <Select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            options={tiposOptions}
          />
          <Select
            value={socioFilter}
            onChange={(e) => setSocioFilter(e.target.value)}
            options={sociosOptions}
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
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Results */}
      <Card title={`Aportaciones (${filteredAportaciones.length})`}>
        {filteredAportaciones.length > 0 ? (
          <Table
            headers={[
              "Fecha",
              "Socio",
              "Tipo",
              "Monto",
              "Método Pago",
              "Estado",
              "Comprobante",
              "Acciones",
            ]}
          >
            {filteredAportaciones
              .sort(
                (a, b) =>
                  new Date(b.fechaAportacion).getTime() -
                  new Date(a.fechaAportacion).getTime()
              )
              .map((aportacion: Aportacione) => {
                const socio = sociosArray.find(
                  (s: Socio) => s.idSocio === aportacion.idSocio
                );
                const tipo = tiposArray.find(
                  (t: TiposAportacion) =>
                    t.idTipoAportacion === aportacion.idTipoAportacion
                );

                return (
                  <tr key={aportacion.idAportacion}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(aportacion.fechaAportacion).toLocaleDateString(
                        "es-CO"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">
                          {socio
                            ? `${socio.nombres} ${socio.apellidos}`
                            : "Socio no encontrado"}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {socio?.cedula}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tipo?.nombreTipo || "Tipo no encontrado"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {aportacion.monto.toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {aportacion.metodoPago || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(
                          aportacion.estado || ""
                        )}`}
                      >
                        {aportacion.estado || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {aportacion.numeroComprobante || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {aportacion.estado === "Pendiente" && (
                          <>
                            <Button size="sm" variant="secondary">
                              Aprobar
                            </Button>
                            <Button size="sm" variant="danger">
                              Rechazar
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="secondary">
                          Ver
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </Table>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No hay aportaciones
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ||
              estadoFilter ||
              tipoFilter ||
              socioFilter ||
              fechaInicio ||
              fechaFin
                ? "No se encontraron aportaciones que coincidan con los filtros."
                : "No hay aportaciones registradas."}
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
                Nueva Aportación
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
                  ...sociosOptions.slice(1),
                ]}
              />
              <Select
                label="Tipo de Aportación"
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
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Método de Pago"
                  options={[
                    { value: "", label: "Seleccione método" },
                    { value: "Efectivo", label: "Efectivo" },
                    { value: "Transferencia", label: "Transferencia" },
                    { value: "Cheque", label: "Cheque" },
                    { value: "Tarjeta", label: "Tarjeta" },
                  ]}
                />
                <Input label="Fecha de Aportación" type="date" />
              </div>
              <Input
                label="Número de Comprobante"
                placeholder="Número de comprobante"
              />
              <Input
                label="Motivo/Descripción"
                placeholder="Motivo de la aportación"
              />
              <Input
                label="Observaciones"
                placeholder="Observaciones adicionales (opcional)"
              />
              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </Button>
                <Button>Registrar Aportación</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
