import React from 'react';
import { usePagosPorEvento } from '../../pagos/hooks/pago.queries';
import { PagoResponse } from '../../pagos/types/pago.types';
import { useUsuariosOrganizador } from '../../usuarios/hooks/useUsuariosOrganizador';
import {
  Loader2, Receipt, CheckCircle, XCircle, Clock
} from 'lucide-react';

const estadoIcon = (estadoPago: PagoResponse['estadoPago']) => {
  switch (estadoPago) {
    case 'EXITOSO': return <CheckCircle size={12} />;
    case 'FALLIDO': return <XCircle size={12} />;
    case 'PENDIENTE': return <Clock size={12} />;
    default: return null;
  }
};

const estadoStyle = (estadoPago: PagoResponse['estadoPago']) => {
  switch (estadoPago) {
    case 'EXITOSO': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    case 'FALLIDO': return 'text-red-400 bg-red-500/10 border-red-500/30';
    case 'PENDIENTE': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  }
};

interface EventoPagosTabProps {
  idEvento: number;
}

export const EventoPagosTab: React.FC<EventoPagosTabProps> = ({ idEvento }) => {
  const { data: pagos, isLoading, error } = usePagosPorEvento(idEvento);
  const { data: usuarios = new Map() } = useUsuariosOrganizador();

  const getUsuarioNombre = (idUsuario: number): string => {
    const u = usuarios.get(idUsuario);
    if (!u) return `#${idUsuario}`;
    return `${u.nombres} ${u.apellidos}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10 text-gray-400">
        <Loader2 className="animate-spin mr-2" size={18} /> Cargando transacciones...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-400 text-sm">Error al cargar el historial de pagos.</div>;
  }

  if (!pagos || pagos.length === 0) {
    return (
      <div className="text-center py-10">
        <Receipt className="mx-auto text-gray-700 mb-3" size={40} />
        <p className="text-gray-500 text-sm">No hay transacciones registradas para este evento.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-white/5">
            <th className="pb-3 pr-4 font-medium">Pago ID</th>
            <th className="pb-3 pr-4 font-medium">Tipo</th>
            <th className="pb-3 pr-4 font-medium">Estado</th>
            <th className="pb-3 pr-4 font-medium">Monto</th>
            <th className="pb-3 pr-4 font-medium">Ticket / Usuario</th>
            <th className="pb-3 font-medium">Fecha</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {pagos.map((p) => (
            <tr key={p.idPago} className="hover:bg-white/3 transition-colors">
              <td className="py-3 pr-4 font-mono text-gray-300">#{p.idPago}</td>
              <td className="py-3 pr-4">
                <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                  p.tipoPago === 'COBRO' 
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' 
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {p.tipoPago}
                </span>
              </td>
              <td className="py-3 pr-4">
                <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${estadoStyle(p.estadoPago)}`}>
                  {estadoIcon(p.estadoPago)}
                  {p.estadoPago}
                </span>
              </td>
              <td className="py-3 pr-4 text-gray-300 font-medium">
                {p.tipoPago === 'REEMBOLSO' ? '-' : ''}{p.monto} {p.moneda}
              </td>
              <td className="py-3 pr-4 text-xs text-gray-500">
                T: <span className="font-mono text-gray-400">#{p.idTicket}</span><br/>
                U: <span className="text-gray-300">{getUsuarioNombre(p.usuarioId)}</span>
              </td>
              <td className="py-3 text-gray-500 text-xs">
                {new Date(p.creadoEn).toLocaleDateString('es-CO', {
                  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
