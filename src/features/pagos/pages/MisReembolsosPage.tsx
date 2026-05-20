import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMisSolicitudes, useCancelarReembolso } from '../hooks/reembolso.queries';
import { ReembolsoResponse } from '../types/reembolso.types';
import {
  Loader2, RefreshCcw, XCircle, CheckCircle, Clock,
  Ban, ArrowLeft, CalendarDays, AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../../app/store/auth.store';

const estadoIcon = (estado: ReembolsoResponse['estado']) => {
  switch (estado) {
    case 'SOLICITADA': return <Clock size={14} />;
    case 'EN_REVISION': return <RefreshCcw size={14} />;
    case 'APROBADA': return <CheckCircle size={14} />;
    case 'RECHAZADA': return <XCircle size={14} />;
    case 'PROCESADA': return <CheckCircle size={14} className="text-green-500" />;
    case 'CANCELADA': return <Ban size={14} />;
    default: return null;
  }
};

const estadoStyle = (estado: ReembolsoResponse['estado']) => {
  switch (estado) {
    case 'SOLICITADA': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    case 'EN_REVISION': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    case 'APROBADA': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    case 'PROCESADA': return 'text-green-400 bg-green-500/10 border-green-500/30';
    case 'RECHAZADA': return 'text-red-400 bg-red-500/10 border-red-500/30';
    case 'CANCELADA': return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  }
};

const MisReembolsosPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: solicitudes, isLoading, error } = useMisSolicitudes();
  const { mutate: cancelar, isPending: isCancelling } = useCancelarReembolso();

  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleCancelar = (id: number) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta solicitud de reembolso?')) return;
    setCancellingId(id);
    setFeedback(null);
    cancelar(id, {
      onSuccess: () => {
        setFeedback({ type: 'success', msg: `Solicitud #${id} cancelada exitosamente.` });
        setCancellingId(null);
      },
      onError: (err: any) => {
        const msg = err.response?.data?.message || err.response?.data?.detail || err.message || 'Error al cancelar la solicitud.';
        setFeedback({ type: 'error', msg });
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
            Mis Reembolsos
          </h1>
          <p className="text-gray-400">
            Gestiona tus solicitudes de devolución.
          </p>
        </div>
        <Link
          to="/portal"
          className="mt-4 md:mt-0 flex items-center gap-2 bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 border border-white/10 font-medium py-2 px-5 rounded-xl transition-all duration-300"
        >
          <ArrowLeft size={16} />
          Volver al Catálogo
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        {feedback && (
          <div className={`mb-6 px-5 py-4 rounded-xl border font-medium text-sm animate-in fade-in ${
            feedback.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {feedback.type === 'success' ? '✅' : '❌'} {feedback.msg}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
            <p>Cargando tus solicitudes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-400 bg-red-500/5 border border-red-500/10 rounded-2xl">
            Error al cargar las solicitudes. Intenta de nuevo más tarde.
          </div>
        ) : !solicitudes || solicitudes.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/20 border border-white/5 rounded-2xl">
            <RefreshCcw className="mx-auto text-gray-700 mb-4" size={48} />
            <p className="text-gray-400 text-lg">Aún no tienes solicitudes de reembolso.</p>
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
            {solicitudes.map((solicitud) => (
              <div key={solicitud.id} className="rounded-2xl border border-white/5 bg-gray-900/30 backdrop-blur-xl p-5 hover:border-white/10 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">Solicitud #{solicitud.id}</span>
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${estadoStyle(solicitud.estado)}`}>
                        {estadoIcon(solicitud.estado)}
                        {solicitud.estado}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>Ticket <span className="text-gray-400 font-mono">#{solicitud.ticketId}</span></span>
                      <span>Evento <span className="text-gray-400 font-mono">#{solicitud.eventoId}</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {(solicitud.estado === 'SOLICITADA' || solicitud.estado === 'EN_REVISION') && (
                      <button
                        onClick={() => handleCancelar(solicitud.id)}
                        disabled={isCancelling && cancellingId === solicitud.id}
                        className="flex items-center gap-2 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-2 rounded-xl hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isCancelling && cancellingId === solicitud.id ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-black/20 rounded-xl p-4 space-y-3">
                  <div>
                    <span className="text-xs text-gray-500 uppercase font-medium">Motivo de Solicitud</span>
                    <p className="text-sm text-gray-300 mt-1">{solicitud.motivoSolicitud}</p>
                  </div>
                  
                  {solicitud.comentarioOrganizador && (
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-xs text-gray-500 uppercase font-medium">Respuesta del Organizador</span>
                      <p className="text-sm text-indigo-200 mt-1">{solicitud.comentarioOrganizador}</p>
                    </div>
                  )}

                  {solicitud.montoAprobado && (
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-xs text-gray-500 uppercase font-medium">Monto Aprobado</span>
                      <p className="text-sm text-emerald-400 font-medium mt-1">${solicitud.montoAprobado}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-2">
                    <p className="text-xs text-gray-500">
                      Creada: {new Date(solicitud.fechaSolicitud).toLocaleDateString('es-CO')}
                    </p>
                    <p className="text-xs text-gray-500">
                      Actualizada: {new Date(solicitud.fechaActualizacion).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisReembolsosPage;
