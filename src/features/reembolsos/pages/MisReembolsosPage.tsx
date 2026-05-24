import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMisSolicitudes, useCancelarSolicitud } from '../hooks/reembolso.queries';
import { SolicitudReembolsoResponse } from '../types/reembolso.types';
import { reembolsoEstadoIcon, reembolsoEstadoStyle } from '../utils/reembolsoHelpers';
import { Loader2, Ban, AlertTriangle, RefreshCcw, CalendarDays } from 'lucide-react';
import { useAuthStore } from '../../../app/store/auth.store';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Modal } from '../../../components/ui/Modal';

export default function MisReembolsosPage() {
  const { user } = useAuthStore();
  const { data: solicitudes, isLoading, error } = useMisSolicitudes();
  const { mutate: cancelar, isPending: isCancelling } = useCancelarSolicitud();

  const [confirmCancel, setConfirmCancel] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleCancelar = (id: number) => {
    setConfirmCancel(null);
    cancelar(id, {
      onSuccess: () => {
        setFeedback({ type: 'success', msg: `Solicitud #${id} cancelada.` });
      },
      onError: (err: any) => {
        setFeedback({ type: 'error', msg: err.response?.data?.message || 'Error al cancelar la solicitud.' });
      },
    });
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
      <PageHeader
        title="Mis Solicitudes de Reembolso"
        subtitle={`Bienvenido, ${user?.username}. Gestiona tus solicitudes de reembolso.`}
      />

      {feedback && (
        <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${feedback.type === 'success' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-red-500/20 bg-red-500/10 text-red-400'}`}>
          {feedback.msg}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-gray-900/20 border border-white/5 rounded-2xl">
          <p className="text-red-400">Error al cargar las solicitudes.</p>
        </div>
      ) : !solicitudes || solicitudes.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/20 border border-white/5 rounded-2xl">
          <RefreshCcw className="mx-auto text-gray-700 mb-4" size={48} />
          <p className="text-gray-400 text-lg">Aún no tienes solicitudes de reembolso.</p>
          <Link to="/dashboard/mis-tickets" className="inline-flex items-center gap-2 mt-4 text-indigo-400 hover:text-indigo-300 text-sm">
            <CalendarDays size={16} /> Ir a Mis Tickets
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {solicitudes.map((solicitud) => (
            <div key={solicitud.idSolicitud} className="rounded-2xl border border-white/5 bg-gray-900/30 p-5 backdrop-blur-xl">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-white">Solicitud #{solicitud.idSolicitud}</p>
                  <p className="text-xs text-gray-500">Ticket #{solicitud.idTicket} · Evento #{solicitud.idEvento}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${reembolsoEstadoStyle(solicitud.estado)}`}>
                  {reembolsoEstadoIcon(solicitud.estado)} {solicitud.estado}
                </span>
              </div>

              <div className="mb-3 rounded-lg bg-gray-950/50 p-3 text-sm text-gray-300">
                {solicitud.motivo}
              </div>

              {solicitud.respuestaOrganizador && (
                <div className="mb-3 rounded-lg bg-blue-500/10 border border-blue-500/20 p-2 text-xs text-blue-300">
                  Respuesta: {solicitud.respuestaOrganizador}
                </div>
              )}

              {solicitud.montoAprobado != null && (
                <div className="mb-3 text-xs text-emerald-400">
                  Monto aprobado: ${solicitud.montoAprobado.toLocaleString()}
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{new Date(solicitud.fechaSolicitud).toLocaleDateString()}</span>
                {(solicitud.estado === 'SOLICITADA' || solicitud.estado === 'EN_REVISION') && (
                  <button
                    onClick={() => setConfirmCancel(solicitud.idSolicitud)}
                    disabled={isCancelling}
                    className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                  >
                    <Ban size={12} /> Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={confirmCancel !== null} onClose={() => setConfirmCancel(null)} title="Cancelar Solicitud" size="sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertTriangle size={20} className="text-red-400 shrink-0" />
            <p className="text-sm text-red-300">¿Estás seguro de cancelar esta solicitud de reembolso?</p>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setConfirmCancel(null)} className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors">
              Mantener
            </button>
            <button
              onClick={() => confirmCancel && handleCancelar(confirmCancel)}
              disabled={isCancelling}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition-colors disabled:opacity-50"
            >
              {isCancelling ? 'Cancelando...' : 'Sí, Cancelar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
