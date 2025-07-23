import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, Alert } from "../ui";
import {
  aportacionSchema,
  type AportacionFormData,
} from "../../schemas/validations";
import { apiService } from "../../services/api";
import { X } from "lucide-react";
import type { Socio } from "../../types/api";

interface AportacionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  aportacion?: any; // Para edición
}

export default function AportacionForm({
  onSuccess,
  onCancel,
  aportacion,
}: AportacionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loadingSocios, setLoadingSocios] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AportacionFormData>({
    resolver: zodResolver(aportacionSchema),
    defaultValues: aportacion
      ? {
          idSocio: aportacion.idSocio || 0,
          idTipoAportacion: aportacion.idTipoAportacion || 1,
          numeroComprobante: aportacion.numeroComprobante || "",
          monto: aportacion.monto || 0,
          fechaAportacion: aportacion.fechaAportacion || "",
          metodoPago: aportacion.metodoPago || "Efectivo",
          motivo: aportacion.motivo || "",
          observaciones: aportacion.observaciones || "",
        }
      : {
          idSocio: 0,
          idTipoAportacion: 1,
          numeroComprobante: "",
          monto: 0,
          fechaAportacion: "",
          metodoPago: "Efectivo",
          motivo: "",
          observaciones: "",
        },
  });

  useEffect(() => {
    const fetchSocios = async () => {
      try {
        const sociosData = await apiService.getSocios();
        setSocios(Array.isArray(sociosData) ? sociosData : []);
      } catch (err) {
        console.error("Error loading socios:", err);
      } finally {
        setLoadingSocios(false);
      }
    };

    fetchSocios();
  }, []);

  const onSubmit: SubmitHandler<AportacionFormData> = async (data) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...data,
        fechaRegistro: aportacion
          ? aportacion.fechaRegistro
          : new Date().toISOString(),
        // Generar número de comprobante único si no existe
        numeroComprobante: data.numeroComprobante || `APT-${Date.now()}`,
      };

      if (aportacion) {
        await apiService.updateAportacion(aportacion.idAportacion, payload);
      } else {
        await apiService.createAportacion(payload);
      }

      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al guardar la aportación"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const tipoOptions = [
    { value: "1", label: "Aportación Regular" },
    { value: "2", label: "Aportación Extraordinaria" },
    { value: "3", label: "Aportación Especial" },
  ];

  const metodoPagoOptions = [
    { value: "Efectivo", label: "Efectivo" },
    { value: "Transferencia", label: "Transferencia" },
    { value: "Cheque", label: "Cheque" },
    { value: "Tarjeta", label: "Tarjeta" },
    { value: "PSE", label: "PSE" },
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
            {aportacion ? "Editar Aportación" : "Crear Nueva Aportación"}
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

            <Select
              label="Tipo de Aportación *"
              {...register("idTipoAportacion", { valueAsNumber: true })}
              options={tipoOptions}
              error={errors.idTipoAportacion?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Monto *"
              type="number"
              step="0.01"
              min="0.01"
              {...register("monto", {
                valueAsNumber: true,
                setValueAs: (v) => parseFloat(Number(v).toFixed(2)),
              })}
              error={errors.monto?.message}
              placeholder="0.00"
            />


            <Input
              label="Número de Comprobante"
              {...register("numeroComprobante")}
              error={errors.numeroComprobante?.message}
              placeholder="Dejar vacío para generar automáticamente"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Fecha de Aportación *"
              type="date"
              {...register("fechaAportacion")}
              error={errors.fechaAportacion?.message}
            />

            <Select
              label="Método de Pago *"
              {...register("metodoPago")}
              options={metodoPagoOptions}
              error={errors.metodoPago?.message}
            />
          </div>

          <Input
            label="Motivo"
            {...register("motivo")}
            error={errors.motivo?.message}
            placeholder="Motivo de la aportación (opcional)"
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
                : aportacion
                ? "Actualizar"
                : "Crear Aportación"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
