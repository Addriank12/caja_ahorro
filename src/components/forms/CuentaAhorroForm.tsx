import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, Alert } from "../ui";
import {
  cuentaAhorroSchema,
  type CuentaAhorroFormData,
} from "../../schemas/validations";
import { apiService } from "../../services/api";
import { X } from "lucide-react";
import type { Socio } from "../../types/api";

interface CuentaAhorroFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  cuenta?: any; // Para edición
}

export default function CuentaAhorroForm({
  onSuccess,
  onCancel,
  cuenta,
}: CuentaAhorroFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loadingSocios, setLoadingSocios] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CuentaAhorroFormData>({
    resolver: zodResolver(cuentaAhorroSchema),
    defaultValues: cuenta
      ? {
          idSocio: cuenta.idSocio || 0,
          numeroCuenta: cuenta.numeroCuenta || "",
          tipoCuenta: cuenta.tipoCuenta || "Ahorro",
          saldoActual: cuenta.saldoActual || 0,
          estado: cuenta.estado || "Activa",
          observaciones: cuenta.observaciones || "",
        }
      : {
          idSocio: 0,
          numeroCuenta: "",
          tipoCuenta: "Ahorro",
          saldoActual: 0,
          estado: "Activa",
          observaciones: "",
        },
  });

  useEffect(() => {
    const fetchSocios = async () => {
      try {
        const sociosData = await apiService.getSocios();
        setSocios(sociosData || []);
      } catch (err) {
        console.error("Error loading socios:", err);
      } finally {
        setLoadingSocios(false);
      }
    };

    fetchSocios();
  }, []);

  const onSubmit: SubmitHandler<CuentaAhorroFormData> = async (data) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...data,
        fechaApertura: cuenta
          ? cuenta.fechaApertura
          : new Date().toISOString().split("T")[0],
        fechaCreacion: cuenta ? cuenta.fechaCreacion : new Date().toISOString(),
        // Generar número de cuenta único si no existe
        numeroCuenta: data.numeroCuenta || `CTA-${Date.now()}`,
      };

      if (cuenta) {
        await apiService.updateCuentaAhorro(cuenta.idCuenta, payload);
      } else {
        await apiService.createCuentaAhorro(payload);
      }

      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al guardar la cuenta"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const tipoOptions = [
    { value: "Ahorro", label: "Ahorro" },
    { value: "Corriente", label: "Corriente" },
    { value: "Plazo Fijo", label: "Plazo Fijo" },
  ];

  const estadoOptions = [
    { value: "Activa", label: "Activa" },
    { value: "Inactiva", label: "Inactiva" },
    { value: "Cerrada", label: "Cerrada" },
    { value: "Bloqueada", label: "Bloqueada" },
  ];

  const socioOptions = socios.map((socio) => ({
    value: socio.idSocio.toString(),
    label: `${socio.nombres} ${socio.apellidos} - ${socio.cedula}`,
  }));

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-6 border w-full max-w-3xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium text-gray-900">
            {cuenta
              ? "Editar Cuenta de Ahorro"
              : "Crear Nueva Cuenta de Ahorro"}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <Alert type="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Socio *
              </label>
              {loadingSocios ? (
                <div className="flex items-center justify-center p-3 border rounded-md">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-500">
                    Cargando socios...
                  </span>
                </div>
              ) : (
                <Select
                  {...register("idSocio", { valueAsNumber: true })}
                  options={socioOptions}
                  placeholder="Seleccione un socio"
                  error={errors.idSocio?.message}
                />
              )}
            </div>

            <Input
              label="Número de Cuenta"
              {...register("numeroCuenta")}
              error={errors.numeroCuenta?.message}
              placeholder="Dejar vacío para generar automáticamente"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Tipo de Cuenta *"
              {...register("tipoCuenta")}
              options={tipoOptions}
              error={errors.tipoCuenta?.message}
            />

            <Select
              label="Estado *"
              {...register("estado")}
              options={estadoOptions}
              error={errors.estado?.message}
            />
          </div>

        <Input
          label="Saldo Actual *"
          type="number"
          step="0.01"
          min="0"
          {...register("saldoActual", {
            valueAsNumber: true,
            setValueAs: (v) => parseFloat(Number(v).toFixed(2)),
          })}
          error={errors.saldoActual?.message}
          placeholder="0.00"
        />


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              {...register("observaciones")}
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Observaciones adicionales (opcional)"
            />
            {errors.observaciones && (
              <p className="mt-1 text-sm text-red-600">
                {errors.observaciones.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || loadingSocios}>
              {isSubmitting
                ? "Guardando..."
                : cuenta
                ? "Actualizar"
                : "Crear Cuenta"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
