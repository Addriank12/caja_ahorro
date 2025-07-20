import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, Alert } from "../ui";
import {
  movimientoSchema,
  type MovimientoFormData,
} from "../../schemas/validations";
import { apiService } from "../../services/api";
import { X } from "lucide-react";
import type { CuentasAhorro } from "../../types/api";

interface MovimientoFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  movimiento?: any; // Para edición
}

export default function MovimientoForm({
  onSuccess,
  onCancel,
  movimiento,
}: MovimientoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cuentas, setCuentas] = useState<CuentasAhorro[]>([]);
  const [loadingCuentas, setLoadingCuentas] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MovimientoFormData>({
    resolver: zodResolver(movimientoSchema),
    defaultValues: movimiento
      ? {
          idCuentaAhorro: movimiento.idCuentaAhorro || 0,
          tipoMovimiento: movimiento.tipoMovimiento || "Deposito",
          monto: movimiento.monto || 0,
          descripcion: movimiento.descripcion || "",
          numeroComprobante: movimiento.numeroComprobante || "",
        }
      : {
          idCuentaAhorro: 0,
          tipoMovimiento: "Deposito",
          monto: 0,
          descripcion: "",
          numeroComprobante: "",
        },
  });

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const cuentasData = await apiService.getCuentasAhorro();
        setCuentas(Array.isArray(cuentasData) ? cuentasData : []);
      } catch (err) {
        console.error("Error loading cuentas:", err);
      } finally {
        setLoadingCuentas(false);
      }
    };

    fetchCuentas();
  }, []);

  const onSubmit: SubmitHandler<MovimientoFormData> = async (data) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...data,
        fechaMovimiento: movimiento
          ? movimiento.fechaMovimiento
          : new Date().toISOString(),
        saldoAnterior: movimiento ? movimiento.saldoAnterior : 0, // Se calculará en el backend
        saldoNuevo: movimiento ? movimiento.saldoNuevo : 0, // Se calculará en el backend
        // Generar número de comprobante único si no existe
        numeroComprobante: data.numeroComprobante || `COMP-${Date.now()}`,
      };

      if (movimiento) {
        await apiService.updateMovimiento(movimiento.idMovimiento, payload);
      } else {
        await apiService.createMovimiento(payload);
      }

      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al guardar el movimiento"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const tipoOptions = [
    { value: "Deposito", label: "Depósito" },
    { value: "Retiro", label: "Retiro" },
    { value: "Transferencia", label: "Transferencia" },
    { value: "Interes", label: "Interés" },
  ];

  const cuentaOptions = cuentas.map((cuenta) => ({
    value: cuenta.idCuentaAhorro.toString(),
    label: `${cuenta.numeroCuenta || "Sin número"} - ${
      cuenta.estado || "Sin estado"
    }`,
  }));

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-6 border w-full max-w-3xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium text-gray-900">
            {movimiento ? "Editar Movimiento" : "Crear Nuevo Movimiento"}
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
                Cuenta de Ahorro *
              </label>
              {loadingCuentas ? (
                <div className="flex items-center justify-center p-3 border rounded-md">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-500">
                    Cargando cuentas...
                  </span>
                </div>
              ) : (
                <Select
                  {...register("idCuentaAhorro", { valueAsNumber: true })}
                  options={cuentaOptions}
                  placeholder="Seleccione una cuenta"
                  error={errors.idCuentaAhorro?.message}
                />
              )}
            </div>

            <Select
              label="Tipo de Movimiento *"
              {...register("tipoMovimiento")}
              options={tipoOptions}
              error={errors.tipoMovimiento?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Monto *"
              type="number"
              step="0.01"
              min="0.01"
              {...register("monto", { valueAsNumber: true })}
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

          <Input
            label="Descripción *"
            {...register("descripcion")}
            error={errors.descripcion?.message}
            placeholder="Descripción del movimiento"
          />

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || loadingCuentas}>
              {isSubmitting
                ? "Guardando..."
                : movimiento
                ? "Actualizar"
                : "Crear Movimiento"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
