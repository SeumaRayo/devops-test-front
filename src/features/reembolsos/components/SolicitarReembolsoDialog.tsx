import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../../components/ui/Modal';
import { solicitarReembolsoSchema, SolicitarReembolsoFormValues, MedioReembolso } from '../types/reembolso.types';
import { useSolicitarReembolso } from '../hooks/reembolso.queries';
import { Loader2 } from 'lucide-react';

interface SolicitarReembolsoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: number;
}

export const SolicitarReembolsoDialog: React.FC<SolicitarReembolsoDialogProps> = ({ isOpen, onClose, ticketId }) => {
  const { mutate, isPending } = useSolicitarReembolso();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SolicitarReembolsoFormValues>({
    resolver: zodResolver(solicitarReembolsoSchema),
    defaultValues: { medioReembolso: 'CUENTA_BANCARIA' },
  });

  const medio = watch('medioReembolso');

  const onSubmit = (values: SolicitarReembolsoFormValues) => {
    mutate({ ticketId, values }, {
      onSuccess: () => {
        setFeedback({ type: 'success', msg: 'Solicitud enviada correctamente.' });
      },
      onError: (err: any) => {
        setFeedback({ type: 'error', msg: err.response?.data?.message || 'Error al enviar la solicitud.' });
      },
    });
  };

  const inputClass = 'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60';
  const labelClass = 'block text-xs font-medium text-gray-400 mb-1.5';
  const errorClass = 'mt-1 text-xs text-red-400';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Solicitar Reembolso" size="lg">
      {feedback ? (
        <div className="text-center py-4">
          <p className={`text-sm ${feedback.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{feedback.msg}</p>
          <button onClick={onClose} className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm">Cerrar</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Motivo de la solicitud</label>
              <textarea {...register('motivoSolicitud')} className={inputClass} rows={3} placeholder="Explica por qué solicitas el reembolso..." />
              {errors.motivoSolicitud && <p className={errorClass}>{errors.motivoSolicitud.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Medio de Reembolso</label>
              <select {...register('medioReembolso')} className={inputClass}>
                <option value="CUENTA_BANCARIA">Cuenta Bancaria</option>
                <option value="NEQUI">Nequi</option>
                <option value="DAVIPLATA">DaviPlata</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Titular de la cuenta</label>
              <input {...register('titularCuenta')} className={inputClass} />
              {errors.titularCuenta && <p className={errorClass}>{errors.titularCuenta.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Documento del titular</label>
              <input {...register('documentoTitular')} className={inputClass} />
              {errors.documentoTitular && <p className={errorClass}>{errors.documentoTitular.message}</p>}
            </div>

            {(medio === 'CUENTA_BANCARIA') && (
              <>
                <div>
                  <label className={labelClass}>Entidad Financiera</label>
                  <input {...register('entidadFinanciera')} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Tipo de Cuenta</label>
                  <select {...register('tipoCuenta')} className={inputClass}>
                    <option value="">Selecciona...</option>
                    <option value="AHORROS">Ahorros</option>
                    <option value="CORRIENTE">Corriente</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Número de Cuenta</label>
                  <input {...register('numeroCuenta')} className={inputClass} />
                </div>
              </>
            )}

            <div>
              <label className={labelClass}>Correo de Contacto</label>
              <input {...register('correoContacto')} className={inputClass} type="email" />
              {errors.correoContacto && <p className={errorClass}>{errors.correoContacto.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Teléfono de Contacto</label>
              <input {...register('telefonoContacto')} className={inputClass} />
              {errors.telefonoContacto && <p className={errorClass}>{errors.telefonoContacto.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Observaciones (opcional)</label>
              <textarea {...register('observaciones')} className={inputClass} rows={2} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isPending} className="rounded-xl bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
              {isPending ? <Loader2 size={16} className="animate-spin inline" /> : null} Enviar Solicitud
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
