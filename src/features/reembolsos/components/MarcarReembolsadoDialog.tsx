import React from 'react';
import { Loader2, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { useMarcarSolicitudComoReembolsada } from '../hooks/reembolso.queries';
import { useReembolsoError } from '../hooks/useReembolsoError';
import { toast } from 'sonner';
import { SolicitudReembolsoResponse } from '../types/reembolso.types';

interface MarcarReembolsadoDialogProps {
  eventoId: number;
  solicitud: SolicitudReembolsoResponse;
  onClose: () => void;
}

export const MarcarReembolsadoDialog: React.FC<MarcarReembolsadoDialogProps> = ({
  eventoId,
  solicitud,
  onClose,
}) => {
  const { mutate: marcar, isPending } = useMarcarSolicitudComoReembolsada();
  const { handleError } = useReembolsoError();

  const handleConfirm = () => {
    marcar(
      { eventoId, solicitudId: solicitud.idSolicitud },
      {
        onSuccess: () => {
          toast.success('Solicitud marcada como reembolsada. El ticket ha sido liberado.');
          onClose();
        },
        onError: handleError,
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-white/10 rounded-3xl p-8 shadow-2xl w-full max-w-md animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle className="text-green-400" />
            Marcar como Reembolsado
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 bg-gray-800/50 border border-white/5 rounded-xl p-3">
          <p className="text-sm text-gray-400">
            Solicitud <span className="text-white font-mono">#{solicitud.idSolicitud}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Ticket <span className="text-white font-mono">#{solicitud.idTicket}</span>
          </p>
          <p className="text-xs text-gray-500">
            Monto:{' '}
            <span className="text-blue-400 font-medium">{solicitud.montoSolicitado}</span>
          </p>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-4">
          <p className="text-xs text-amber-300 flex items-start gap-2">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>
              Marca esta solicitud como reembolsada solo si ya realizaste el tramite externo de
              devolucion del dinero. Esta accion actualizara el ticket como <strong>REEMBOLSADO</strong> y
              liberara el cupo del evento.
            </span>
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : 'Marcar Reembolsado'}
          </button>
        </div>
      </div>
    </div>
  );
};
