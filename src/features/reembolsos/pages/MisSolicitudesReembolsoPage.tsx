import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMisSolicitudesReembolso, useCancelarSolicitudReembolso } from '../hooks/reembolso.queries';
import { useReembolsoError } from '../hooks/useReembolsoError';
import { SolicitudReembolsoResponse } from '../types/reembolso.types';
import { ReembolsoStatusBadge } from '../components/ReembolsoStatusBadge';
import { DatosReembolsoResumen } from '../components/DatosReembolsoResumen';
import { formatCurrencyCOP, formatDateTime } from '../services/reembolso.helpers';
import { Loader2, RefreshCcw, ArrowLeft, CalendarDays, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

const MisSolicitudesReembolsoPage: React.FC = () => {
  const { data: solicitudes, isLoading, error } = useMisSolicitudesReembolso();
  const { mutate: cancelar, isPending: isCancelling } = useCancelarSolicitudReembolso();
  const { handleError } = useReembolsoError();

  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCancelar = (id: number) => {
    if (!confirm('Estas seguro de que deseas cancelar esta solicitud de reembolso?')) return;
    setCancellingId(id);
    cancelar(id, {
      onSuccess: () => {
        toast.success(`Solicitud #${id} cancelada exitosamente.`);
        setCancellingId(null);
      },
      onError: (err) => {
        handleError(err);
        setCancellingId(null);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 pb-20">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between mt-8 mb-8 bg-gray-900/30 border border-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <RefreshCcw className="text-indigo-400" size={28} />
            Mis Solicitudes de Reembolso
          </h1>
          <p className="text-gray-400">Gestiona tus solicitudes de devolucion.</p>
        </div>
        <Link
          to="/portal"
          className="mt-4 md:mt-0 flex items-center gap-2 bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 border border-white/10 font-medium py-2 px-5 rounded-xl transition-all duration-300"
        >
          <ArrowLeft size={16} />
          Volver al Catalogo
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
            <p>Cargando tus solicitudes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-400 bg-red-500/5 border border-red-500/10 rounded-2xl">
            Error al cargar las solicitudes. Intenta de nuevo mas tarde.
          </div>
        ) : !solicitudes || solicitudes.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/20 border border-white/5 rounded-2xl">
            <RefreshCcw className="mx-auto text-gray-700 mb-4" size={48} />
            <p className="text-gray-400 text-lg">Aun no tienes solicitudes de reembolso.</p>
            <Link
              to="/mis-tickets"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all"
            >
              <CalendarDays size={16} />
              Ir a Mis Tickets
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {solicitudes.map((solicitud: SolicitudReembolsoResponse) => {
              const isExpanded = expandedIds.has(solicitud.idSolicitud);
              const puedeCancelar =
                solicitud.estado === 'SOLICITADA' || solicitud.estado === 'EN_REVISION';

              return (
                <div
                  key={solicitud.idSolicitud}
                  className="rounded-2xl border border-white/5 bg-gray-900/30 backdrop-blur-xl p-5 hover:border-white/10 transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">
                          Solicitud #{solicitud.idSolicitud}
                        </span>
                        <ReembolsoStatusBadge estado={solicitud.estado} />
                      </div>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>
                          Ticket{' '}
                          <span className="text-gray-400 font-mono">#{solicitud.idTicket}</span>
                        </span>
                        <span>
                          Evento{' '}
                          <span className="text-gray-400 font-mono">#{solicitud.idEvento}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {puedeCancelar && (
                        <button
                          onClick={() => handleCancelar(solicitud.idSolicitud)}
                          disabled={isCancelling && cancellingId === solicitud.idSolicitud}
                          className="flex items-center gap-1.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-all disabled:opacity-50"
                        >
                          {isCancelling && cancellingId === solicitud.idSolicitud ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            'Cancelar'
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-xl p-4 space-y-3">
                    <div>
                      <span className="text-xs text-gray-500 uppercase font-medium">Motivo</span>
                      <p className="text-sm text-gray-300 mt-1">{solicitud.motivo}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-gray-500 uppercase font-medium">Monto solicitado</span>
                        <p className="text-sm text-blue-400 font-medium mt-1">
                          {formatCurrencyCOP(solicitud.montoSolicitado)}
                        </p>
                      </div>
                      {solicitud.montoAprobado && (
                        <div>
                          <span className="text-xs text-gray-500 uppercase font-medium">Monto aprobado</span>
                          <p className="text-sm text-emerald-400 font-medium mt-1">
                            {formatCurrencyCOP(solicitud.montoAprobado)}
                          </p>
                        </div>
                      )}
                    </div>

                    {solicitud.respuestaOrganizador && (
                      <div className="pt-2 border-t border-white/5">
                        <span className="text-xs text-gray-500 uppercase font-medium">
                          Respuesta del organizador
                        </span>
                        <p className="text-sm text-indigo-200 mt-1">{solicitud.respuestaOrganizador}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                      <p className="text-xs text-gray-500">
                        Creada: {formatDateTime(solicitud.fechaSolicitud)}
                      </p>
                      {solicitud.fechaRevision && (
                        <p className="text-xs text-gray-500">
                          Revision: {formatDateTime(solicitud.fechaRevision)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Datos de reembolso */}
                  <div className="mt-3">
                    <button
                      onClick={() => toggleExpand(solicitud.idSolicitud)}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      Datos de reembolso
                    </button>
                    {isExpanded && (
                      <div className="mt-2">
                        <DatosReembolsoResumen datos={solicitud.datosReembolso} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisSolicitudesReembolsoPage;
