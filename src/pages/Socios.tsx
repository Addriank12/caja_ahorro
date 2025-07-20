import { useState } from "react";
import {
  Card,
  Button,
  Table,
  LoadingSpinner,
  Alert,
  Input,
} from "../components/ui";
import { useSocios } from "../hooks/useApi";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import type { Socio } from "../types/api";

export default function Socios() {
  const { data: socios, loading, error, refetch } = useSocios();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-gray-600">Cargando socios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert type="error" title="Error al cargar socios">
        {error}
      </Alert>
    );
  }

  const sociosArray = Array.isArray(socios) ? socios : [];
  const filteredSocios = sociosArray.filter(
    (socio: Socio) =>
      socio.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      socio.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      socio.cedula?.includes(searchTerm) ||
      socio.numeroSocio?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Socios
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Administra los socios de la caja de ahorro
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Socio
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre, cédula o número de socio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="secondary" onClick={refetch}>
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Results */}
      <Card title={`Socios (${filteredSocios.length})`}>
        {filteredSocios.length > 0 ? (
          <Table
            headers={[
              "Número",
              "Cédula",
              "Nombre Completo",
              "Teléfono",
              "Estado",
              "Acciones",
            ]}
          >
            {filteredSocios.map((socio: Socio) => (
              <tr key={socio.idSocio}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {socio.numeroSocio || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {socio.cedula || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {`${socio.nombres || ""} ${socio.apellidos || ""}`.trim() ||
                    "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {socio.telefono || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      socio.estado === "Activo"
                        ? "bg-green-100 text-green-800"
                        : socio.estado === "Inactivo"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {socio.estado || "N/A"}
                  </span>
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
          </Table>
        ) : (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No hay socios
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "No se encontraron socios que coincidan con la búsqueda."
                : "Comienza registrando un nuevo socio."}
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
                Crear Nuevo Socio
              </h3>
              <Button
                variant="secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cerrar
              </Button>
            </div>
            <div className="space-y-4">
              <Input label="Cédula" placeholder="Ingrese la cédula" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Nombres" placeholder="Ingrese los nombres" />
                <Input label="Apellidos" placeholder="Ingrese los apellidos" />
              </div>
              <Input
                label="Correo Electrónico"
                type="email"
                placeholder="correo@ejemplo.com"
              />
              <Input label="Teléfono" placeholder="Ingrese el teléfono" />
              <Input label="Dirección" placeholder="Ingrese la dirección" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Ciudad" placeholder="Ingrese la ciudad" />
                <Input label="Fecha de Nacimiento" type="date" />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </Button>
                <Button>Crear Socio</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Users({ className }: { className: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
      />
    </svg>
  );
}
