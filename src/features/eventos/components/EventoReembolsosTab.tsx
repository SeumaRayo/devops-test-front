import React, { useState } from 'react';
import { useReembolsosPorEvento, useRevisarSolicitudReembolso } from '../../reembolsos/hooks/reembolso.queries';
import { useReembolsoError } from '../../reembolsos/hooks/useReembolsoError';
import { SolicitudReembolsoResponse } from '../../reembolsos/types/reembolso.types';
import { ReembolsoStatusBadge } from '../../reembolsos/components/ReembolsoStatusBadge';
import { DatosReembolsoResumen } from '../../reembolsos/components/DatosReembolsoResumen';
import { AprobarReembolsoDialog } from '../../reembolsos/components/AprobarReembolsoDialog';
import { RechazarReembolsoDialog } from '../../reembolsos/components/RechazarReembolsoDialog';
import { MarcarReembolsadoDialog } from '../../reembolsos/components/MarcarReembolsadoDialog';
import { formatCurrencyCOP, formatDateTime } from '../../reembolsos/services/reembolso.helpers';
import { useUsuariosOrganizador } from '../../usuarios/hooks/useUsuariosOrganizador';
import {
  Loader2, RefreshCcw, Eye, CheckCircle, XCircle, User, ChevronDown, ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';

const UsuarioInfo: React.FC<{ userId: number; usuarios: Map<number, { nombres: string; apellidos: string }> }> = ({ userId, usuarios }) => {
  const u = usuarios.get(userId);
  if (!u) return <span className="font-mono text-gray-400">#{userId}</span>;
  return <span className="text-gray-300">{u.nombres} {u.apellidos}</span>;
};

interface EventoReembolsosTabProps {
  idEvento: number;
}

export const EventoReembolsosTab: React.FC<EventoReembolsosTabProps> = ({ idEvento }) => {
  const { data: reembolsos, isLoading, error } = useReembolsosPorEvento(idEvento);
  const { mutate: revisar, isPending: isRevisando } = useRevisarSolicitudReembolso();
  const { handleError } = useReembolsoError();
  const { data: usuarios = new Map() } = useUsuariosOrganizador();

  const [activeActionId, setActiveActionId] = useState<number | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const [aprobarSolicitud, setAprobarSolicitud] = useState<SolicitudReembolsoResponse | null>(null);
  const [rechazarSolicitud, setRechazarSolicitud] = useState<SolicitudReembolsoResponse | null>(null);
  const [marcarSolicitud, setMarcarSolicitud] = useState<SolicitudReembolsoResponse | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleRevisar = (solicitudId: number) => {
    setActiveActionId(solicitudId);
    revisar(
      { eventoId: idEvento, solicitudId },
      {
        onSuccess: () => toast.success('Solicitud cambiada a EN REVISION.'),
        onError: handleError,
        onSettled: () => setActiveActionId(null),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10 text-gray-400">
        <Loader2 className="animate-spin mr-2" size={18} /> Cargando solicitudes...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-400 text-sm">Error al cargar las solicitudes.</div>;
  }

  if (!reembolsos || reembolsos.length === 0) {
    return (
      <div className="text-center py-10">
        <RefreshCcw className="mx-auto text-gray-700 mb-3" size={40} />
        <p className="text-gray-500 text-sm">No hay solicitudes de reembolso para este evento.</p>
      </div>
    );
  }

  const puedeAccionar = (r: SolicitudReembolsoResponse): boolean => {
    return !['RECHAZADA', 'CANCELADA', 'REEMBOLSADA', 'PROCESADA', 'FALLIDA'].includes(r.estado);
  };

  return (
    <div className="space-y-3">
      {reembolsos.map((r) => {
        const isExpanded = expandedIds.has(r.idSolicitud);

        return (
          <div
            key={r.idSolicitud}
            className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-xs text-gray-500 shrink-0">#{r.idSolicitud}</span>
                <ReembolsoStatusBadge estado={r.estado} />
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <User size={10} className="shrink-0" />
                  <UsuarioInfo userId={r.idUsuarioSolicitante} usuarios={usuarios} />
                </span>
                <span className="text-xs text-gray-600 font-mono">
                  T:#{r.idTicket}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                {r.estado === 'SOLICITADA' && (
                  <button
                    onClick={() => handleRevisar(r.idSolicitud)}
                    disabled={activeActionId === r.idSolicitud}
                    className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded hover:bg-blue-500/20 disabled:opacity-50"
                  >
                    {activeActionId === r.idSolicitud && isRevisando ? (
                      <Loader2 size={12} className="animate-spin inline mr-1" />
                    ) : (
                      <Eye size={12} className="inline mr-1" />
                    )}
                    Revisar
                  </button>
                )}
                {(r.estado === 'SOLICITADA' || r.estado === 'EN_REVISION') && (
                  <>
                    <button
                      onClick={() => setAprobarSolicitud(r)}
                      className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded hover:bg-emerald-500/20"
                    >
                      <CheckCircle size={12} className="inline mr-1" /> Aprobar
                    </button>
                    <button
                      onClick={() => setRechazarSolicitud(r)}
                      className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded hover:bg-red-500/20"
                    >
                      <XCircle size={12} className="inline mr-1" /> Rechazar
                    </button>
                  </>
                )}
                {r.estado === 'APROBADA' && (
                  <button
                    onClick={() => setMarcarSolicitud(r)}
                    className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded hover:bg-green-500/20"
                  >
                    <CheckCircle size={12} className="inline mr-1" /> Marcar Reembolsado
                  </button>
                )}
                {!puedeAccionar(r) && (
                  <span className="text-[10px] text-gray-500">Sin acciones</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-xs">
              <div>
                <span className="text-gray-500">Motivo: </span>
                <span className="text-gray-300 truncate inline max-w-[200px]" title={r.motivo}>
                  {r.motivo}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Monto: </span>
                <span className="text-blue-400 font-medium">{formatCurrencyCOP(r.montoSolicitado)}</span>
                {r.montoAprobado && (
                  <span className="text-emerald-400 ml-1">
                    (aprob: {formatCurrencyCOP(r.montoAprobado)})
                  </span>
                )}
              </div>
              <div>
                <span className="text-gray-500">Fecha: </span>
                <span className="text-gray-400">{formatDateTime(r.fechaSolicitud)}</span>
              </div>
            </div>

            {r.respuestaOrganizador && (
              <p className="text-xs text-indigo-300 mt-2 italic">
                R: {r.respuestaOrganizador}
              </p>
            )}

            {/* Datos reembolso */}
            <button
              onClick={() => toggleExpand(r.idSolicitud)}
              className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-400 mt-2 transition-colors"
            >
              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              Datos para el reembolso
            </button>
            {isExpanded && (
              <div className="mt-2">
                <DatosReembolsoResumen datos={r.datosReembolso} />
              </div>
            )}
          </div>
        );
      })}

      {aprobarSolicitud && (
        <AprobarReembolsoDialog
          eventoId={idEvento}
          solicitud={aprobarSolicitud}
          onClose={() => setAprobarSolicitud(null)}
        />
      )}

      {rechazarSolicitud && (
        <RechazarReembolsoDialog
          eventoId={idEvento}
          solicitud={rechazarSolicitud}
          onClose={() => setRechazarSolicitud(null)}
        />
      )}

      {marcarSolicitud && (
        <MarcarReembolsadoDialog
          eventoId={idEvento}
          solicitud={marcarSolicitud}
          onClose={() => setMarcarSolicitud(null)}
        />
      )}
    </div>
  );
};
