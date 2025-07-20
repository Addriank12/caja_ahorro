import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, Alert } from "../ui";
import { socioSchema, type SocioFormData } from "../../schemas/validations";
import { apiService } from "../../services/api";
import { X } from "lucide-react";

interface SocioFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  socio?: any; // Para edición
}

export default function SocioForm({
  onSuccess,
  onCancel,
  socio,
}: SocioFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SocioFormData>({
    resolver: zodResolver(socioSchema),
    defaultValues: socio
      ? {
          cedula: socio.cedula || "",
          nombres: socio.nombres || "",
          apellidos: socio.apellidos || "",
          correo: socio.correo || "",
          telefono: socio.telefono || "",
          direccion: socio.direccion || "",
          fechaNacimiento: socio.fechaNacimiento
            ? new Date(socio.fechaNacimiento).toISOString().split("T")[0]
            : "",
          ciudad: socio.ciudad || "",
          estado: socio.estado || "Activo",
          observaciones: socio.observaciones || "",
        }
      : {
          cedula: "",
          nombres: "",
          apellidos: "",
          estado: "Activo",
          correo: "",
          telefono: "",
          direccion: "",
          fechaNacimiento: "",
          ciudad: "",
          observaciones: "",
        },
  });

  const onSubmit: SubmitHandler<SocioFormData> = async (data) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...data,
        fechaIngreso: socio
          ? socio.fechaIngreso
          : new Date().toISOString().split("T")[0],
        fechaCreacion: socio ? socio.fechaCreacion : new Date().toISOString(),
        numeroSocio: socio ? socio.numeroSocio : `SOC-${Date.now()}`,
      };

      if (socio) {
        await apiService.updateSocio(socio.idSocio, payload);
      } else {
        await apiService.createSocio(payload);
      }

      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al guardar el socio"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const estadoOptions = [
    { value: "Activo", label: "Activo" },
    { value: "Inactivo", label: "Inactivo" },
    { value: "Suspendido", label: "Suspendido" },
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium text-gray-900">
            {socio ? "Editar Socio" : "Crear Nuevo Socio"}
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
            <Input
              label="Cédula *"
              {...register("cedula")}
              error={errors.cedula?.message}
              placeholder="Ingrese la cédula"
            />

            <Select
              label="Estado *"
              {...register("estado")}
              options={estadoOptions}
              error={errors.estado?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombres *"
              {...register("nombres")}
              error={errors.nombres?.message}
              placeholder="Ingrese los nombres"
            />

            <Input
              label="Apellidos *"
              {...register("apellidos")}
              error={errors.apellidos?.message}
              placeholder="Ingrese los apellidos"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Correo Electrónico"
              type="email"
              {...register("correo")}
              error={errors.correo?.message}
              placeholder="correo@ejemplo.com"
            />

            <Input
              label="Teléfono"
              {...register("telefono")}
              error={errors.telefono?.message}
              placeholder="Ingrese el teléfono"
            />
          </div>

          <Input
            label="Dirección"
            {...register("direccion")}
            error={errors.direccion?.message}
            placeholder="Ingrese la dirección"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Ciudad"
              {...register("ciudad")}
              error={errors.ciudad?.message}
              placeholder="Ingrese la ciudad"
            />

            <Input
              label="Fecha de Nacimiento"
              type="date"
              {...register("fechaNacimiento")}
              error={errors.fechaNacimiento?.message}
            />
          </div>

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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Guardando..."
                : socio
                ? "Actualizar"
                : "Crear Socio"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
