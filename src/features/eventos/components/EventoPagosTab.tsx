import React from 'react';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

interface PagoResponse {
  id: number;
  estado: string;
  monto: number;
  fechaPago: string;
  stripePaymentIntentId: string;
}

interface EventoPagosTabProps {
  idEvento: number;
}

const pagoEstadoStyle = (estado: string) => {
  switch (estado) {
    case 'EXITOSO': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    case 'FALLIDO': return 'text-red-400 bg-red-500/10 border-red-500/30';
    case 'PENDIENTE': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  }
};

const pagoEstadoIcon = (estado: string) => {
  switch (estado) {
    case 'EXITOSO': return <CheckCircle size={14} />;
    case 'FALLIDO': return <XCircle size={14} />;
    case 'PENDIENTE': return <Clock size={14} />;
    default: return null;
  }
};

export const EventoPagosTab: React.FC<EventoPagosTabProps> = ({ idEvento }) => {
  const [pagos, setPagos] = React.useState<PagoResponse[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPagos = async () => {
      try {
        const axios = (await import('../../../lib/axios')).default;
        const { data } = await axios.get<PagoResponse[]>(`/api/v1/eventos/${idEvento}/pagos`);
        setPagos(data);
      } catch {
        setError('Error al cargar pagos.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPagos();
  }, [idEvento]);

  if (isLoading) return <div className="flex justify-center items-center h-40 text-gray-400"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  if (error) return <div className="text-center py-10 text-red-400">{error}</div>;
  if (!pagos || pagos.length === 0) return <div className="text-center py-10 text-gray-400">No hay pagos registrados para este evento.</div>;

  return (
    <div className="space-y-3">
      {pagos.map((pago) => (
        <div key={pago.id} className="rounded-xl border border-white/5 bg-gray-900/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-gray-400">#{pago.id}</span>
              <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${pagoEstadoStyle(pago.estado)}`}>
                {pagoEstadoIcon(pago.estado)} {pago.estado}
              </span>
              <span className="text-sm text-gray-300">${pago.monto?.toLocaleString()}</span>
            </div>
            <span className="text-xs text-gray-500">{new Date(pago.fechaPago).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
