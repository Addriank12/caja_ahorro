import { useEffect, useState } from 'react';
import { Input } from '../components/ui';
import { Button } from '../components/ui';
import { Card } from '../components/ui';
import axios from 'axios';

interface Credito {
  id: number;
  cedulaSocio: string;
  monto: number;
  plazoMeses: number;
  tasaInteres: number;
  estado: string;
}

export default function Creditos() {
  const [creditos, setCreditos] = useState<Credito[]>([]);
  const [cedulaFiltro, setCedulaFiltro] = useState('');

const fetchCreditos = async () => {
  try {
    const response = await axios.get('/api/Creditos');
    const data = Array.isArray(response.data) ? response.data : [];
    console.log("Créditos cargados:", data.length);
    setCreditos(data);
  } catch (error) {
    console.error('Error al cargar los créditos', error);
  }
};

  useEffect(() => {
    fetchCreditos();
  }, []);

  const creditosFiltrados = cedulaFiltro
    ? creditos.filter(c => c.cedulaSocio.includes(cedulaFiltro))
    : creditos;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Gestión de Créditos</h1>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Filtrar por cédula"
          value={cedulaFiltro}
          onChange={e => setCedulaFiltro(e.target.value)}
        />
        <Button onClick={fetchCreditos}>Actualizar</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {creditosFiltrados.map(c => (
          <Card key={c.id} title={`Crédito #${c.id}`}>
            <p><strong>Cédula:</strong> {c.cedulaSocio}</p>
            <p><strong>Monto:</strong> ${c.monto.toFixed(2)}</p>
            <p><strong>Plazo:</strong> {c.plazoMeses} meses</p>
            <p><strong>Interés:</strong> {c.tasaInteres}%</p>
            <p><strong>Estado:</strong> {c.estado}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
