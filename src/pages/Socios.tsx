import { useState } from "react";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import { useSocios } from "../hooks/useApi";
import SocioForm from "../components/forms/SocioForm";
import type { Socio } from "../types/api";
import { Button, Card, Input } from "../components/ui";

export default function Socios() {
  const { data: socios, loading, error, refetch } = useSocios();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSocio, setEditingSocio] = useState<Socio | null>(null);

  const sociosArray = Array.isArray(socios) ? socios : [];

  const filteredSocios = sociosArray.filter(
    (socio: Socio) =>
      socio.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      socio.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      socio.cedula?.includes(searchTerm) ||
      socio.numeroSocio?.includes(searchTerm)
  );

  console.log("Filtered socios:", filteredSocios);

  const handleCreate = () => {
    setEditingSocio(null);
    setShowForm(true);
  };

  const handleEdit = (socio: Socio) => {
    setEditingSocio(socio);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingSocio(null);
    refetch();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingSocio(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error al cargar los socios
            </h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

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
        <Button onClick={handleCreate}>
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
      <Card
        title={`Socios (${filteredSocios.length}) - Total: ${sociosArray.length}`}
      >
        {/* Debug info */}
        <div className="mb-4 p-2 bg-gray-100 text-sm rounded">
          <strong>Debug:</strong> Loading: {loading ? "Sí" : "No"}, Error:{" "}
          {error || "Ninguno"}, Data type: {typeof socios}, Is array:{" "}
          {Array.isArray(socios) ? "Sí" : "No"}, Raw length:{" "}
          {socios ? (Array.isArray(socios) ? socios.length : "N/A") : "0"}
        </div>

        {filteredSocios.length > 0 ? (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cédula
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre Completo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSocios.map((socio: Socio) => (
                  <tr key={socio.idSocio} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {socio.numeroSocio || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {socio.cedula || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {`${socio.nombres || ""} ${
                        socio.apellidos || ""
                      }`.trim() || "N/A"}
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
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEdit(socio)}
                        >
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

      {showForm && (
        <SocioForm
          socio={editingSocio}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
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
