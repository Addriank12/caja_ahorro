import { Card, LoadingSpinner, Alert } from "../components/ui";
import { useSocios, useCuentasAhorro, useAportaciones } from "../hooks/useApi";
import { Users, CreditCard, Banknote, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const {
    data: socios,
    loading: sociosLoading,
    error: sociosError,
  } = useSocios();
  const {
    data: cuentas,
    loading: cuentasLoading,
    error: cuentasError,
  } = useCuentasAhorro();
  const {
    data: aportaciones,
    loading: aportacionesLoading,
    error: aportacionesError,
  } = useAportaciones();

  const loading = sociosLoading || cuentasLoading || aportacionesLoading;
  const error = sociosError || cuentasError || aportacionesError;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-gray-600">Cargando dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert type="error" title="Error al cargar datos">
        {error}
      </Alert>
    );
  }

  const stats = [
    {
      name: "Total Socios",
      value: Array.isArray(socios) ? socios.length : 0,
      icon: Users,
      color: "text-blue-600 bg-blue-100",
    },
    {
      name: "Cuentas Activas",
      value: Array.isArray(cuentas)
        ? cuentas.filter((c: any) => c.estado === "Activa").length
        : 0,
      icon: CreditCard,
      color: "text-green-600 bg-green-100",
    },
    {
      name: "Total Aportaciones",
      value: Array.isArray(aportaciones) ? aportaciones.length : 0,
      icon: Banknote,
      color: "text-yellow-600 bg-yellow-100",
    },
    {
      name: "Saldo Total",
      value: Array.isArray(cuentas)
        ? cuentas
            .reduce(
              (total: number, cuenta: any) => total + (cuenta.saldoActual || 0),
              0
            )
            .toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })
        : "$0",
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Resumen general del sistema de caja de ahorro
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title="Socios Recientes">
          <div className="space-y-3">
            {Array.isArray(socios) &&
              socios.slice(0, 5).map((socio: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-gray-100 pb-2"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {socio.nombres} {socio.apellidos}
                    </p>
                    <p className="text-sm text-gray-500">
                      Cédula: {socio.cedula}
                    </p>
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      socio.estado === "Activo"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {socio.estado}
                  </span>
                </div>
              ))}
            {(!Array.isArray(socios) || socios.length === 0) && (
              <p className="text-gray-500 text-center py-4">
                No hay socios registrados
              </p>
            )}
          </div>
        </Card>

        <Card title="Cuentas por Estado">
          <div className="space-y-3">
            {Array.isArray(cuentas) &&
              cuentas.slice(0, 5).map((cuenta: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-gray-100 pb-2"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      Cuenta: {cuenta.numeroCuenta}
                    </p>
                    <p className="text-sm text-gray-500">
                      Tipo: {cuenta.tipoCuenta}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {(cuenta.saldoActual || 0).toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                      })}
                    </p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        cuenta.estado === "Activa"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {cuenta.estado}
                    </span>
                  </div>
                </div>
              ))}
            {(!Array.isArray(cuentas) || cuentas.length === 0) && (
              <p className="text-gray-500 text-center py-4">
                No hay cuentas registradas
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
