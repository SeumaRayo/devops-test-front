import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X, XCircle } from 'lucide-react';
import { rechazarReembolsoSchema, RechazarReembolsoFormData } from '../validations/reembolso.schema';
import { useRechazarSolicitudReembolso } from '../hooks/reembolso.queries';
import { useReembolsoError } from '../hooks/useReembolsoError';
import { toast } from 'sonner';
import { SolicitudReembolsoResponse } from '../types/reembolso.types';

interface RechazarReembolsoDialogProps {
  eventoId: number;
  solicitud: SolicitudReembolsoResponse;
  onClose: () => void;
}

export const RechazarReembolsoDialog: React.FC<RechazarReembolsoDialogProps> = ({
  eventoId,
  solicitud,
  onClose,
}) => {
  const { mutate: rechazar, isPending } = useRechazarSolicitudReembolso();
  const { handleError } = useReembolsoError();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RechazarReembolsoFormData>({
    resolver: zodResolver(rechazarReembolsoSchema),
  });

  const onSubmit = (data: RechazarReembolsoFormData) => {
    rechazar(
      {
        eventoId,
        solicitudId: solicitud.idSolicitud,
        payload: { comentario: data.comentario },
      },
      {
        onSuccess: () => {
          toast.success('Solicitud de reembolso rechazada.');
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
            <XCircle className="text-red-400" />
            Rechazar Reembolso
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
            Motivo del usuario: <span className="text-gray-400">{solicitud.motivo}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Motivo del rechazo
            </label>
            <textarea
              {...register('comentario')}
              className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 placeholder-gray-600"
              rows={4}
              placeholder="Explica el motivo del rechazo..."
            />
            {errors.comentario && (
              <p className="text-xs text-red-400 mt-1">{errors.comentario.message}</p>
            )}
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
              type="submit"
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              {isPending ? <Loader2 size={16} className="animate-spin" /> : 'Confirmar Rechazo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
