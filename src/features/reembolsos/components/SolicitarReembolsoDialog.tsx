import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X, RefreshCcw, Upload, FileText } from 'lucide-react';
import {
  crearSolicitudReembolsoSchema,
  CrearSolicitudReembolsoFormData,
} from '../validations/reembolso.schema';
import { useCrearSolicitudReembolso } from '../hooks/reembolso.queries';
import { useReembolsoError } from '../hooks/useReembolsoError';
import { getNumeroCuentaLabel } from '../services/reembolso.helpers';
import { toast } from 'sonner';

interface SolicitarReembolsoDialogProps {
  ticketId: number;
  ticketNombre: string;
  montoPagado: number;
  moneda: string;
  onClose: () => void;
}

const inputClass =
  'w-full bg-gray-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-gray-600';
const labelClass = 'block text-sm font-medium text-gray-300 mb-1.5';
const errorClass = 'text-xs text-red-400 mt-0.5';
const sectionClass = 'border-t border-white/5 pt-4 mt-4';

export const SolicitarReembolsoDialog: React.FC<SolicitarReembolsoDialogProps> = ({
  ticketId,
  ticketNombre,
  montoPagado,
  moneda,
  onClose,
}) => {
  const { mutate: solicitar, isPending } = useCrearSolicitudReembolso();
  const { handleError } = useReembolsoError();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CrearSolicitudReembolsoFormData>({
    resolver: zodResolver(crearSolicitudReembolsoSchema),
    defaultValues: {
      medioReembolso: 'CUENTA_BANCARIA',
      tipoCuenta: 'AHORROS',
    },
  });

  const medioSeleccionado = watch('medioReembolso');
  const esCuentaBancaria = medioSeleccionado === 'CUENTA_BANCARIA';
  const certificadoRef = register('certificadoCuenta');
  const documentoAdicionalRef = register('documentoAdicional');

  const [certFileName, setCertFileName] = useState<string | null>(null);
  const [docFileName, setDocFileName] = useState<string | null>(null);

  const onSubmit = (values: CrearSolicitudReembolsoFormData) => {
    solicitar(
      { ticketId, values },
      {
        onSuccess: () => {
          toast.success(
            'Solicitud enviada. El organizador recibira tus datos para revisar el reembolso.'
          );
          onClose();
        },
        onError: handleError,
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-white/10 rounded-3xl p-6 shadow-2xl w-full max-w-lg my-8 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <RefreshCcw className="text-indigo-400" />
            Solicitar Reembolso
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 bg-gray-800/50 border border-white/5 rounded-xl p-3">
          <p className="text-sm text-white font-medium">{ticketNombre}</p>
          <p className="text-xs text-gray-400 mt-1">
            Monto pagado:{' '}
            <span className="text-blue-400 font-medium">
              {new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
              }).format(montoPagado)}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
          {/* Motivo */}
          <div>
            <label className={labelClass}>Motivo de la solicitud</label>
            <textarea
              {...register('motivoSolicitud')}
              className={inputClass}
              rows={3}
              placeholder="Explica por que solicitas el reembolso..."
            />
            {errors.motivoSolicitud && (
              <p className={errorClass}>{errors.motivoSolicitud.message}</p>
            )}
          </div>

          {/* Medio de reembolso */}
          <div>
            <label className={labelClass}>Medio de reembolso</label>
            <select {...register('medioReembolso')} className={inputClass}>
              <option value="CUENTA_BANCARIA">Cuenta Bancaria</option>
              <option value="NEQUI">Nequi</option>
              <option value="DAVIPLATA">Daviplata</option>
              <option value="OTRO">Otro</option>
            </select>
            {errors.medioReembolso && (
              <p className={errorClass}>{errors.medioReembolso.message}</p>
            )}
          </div>

          {/* Titular y documento */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Titular de la cuenta</label>
              <input
                {...register('titularCuenta')}
                className={inputClass}
                placeholder="Nombres y apellidos"
              />
              {errors.titularCuenta && (
                <p className={errorClass}>{errors.titularCuenta.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Documento del titular</label>
              <input
                {...register('documentoTitular')}
                className={inputClass}
                placeholder="CC / NIT"
              />
              {errors.documentoTitular && (
                <p className={errorClass}>{errors.documentoTitular.message}</p>
              )}
            </div>
          </div>

          {/* Contacto */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Correo de contacto</label>
              <input
                {...register('correoContacto')}
                className={inputClass}
                placeholder="correo@ejemplo.com"
                type="email"
              />
              {errors.correoContacto && (
                <p className={errorClass}>{errors.correoContacto.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Telefono de contacto</label>
              <input
                {...register('telefonoContacto')}
                className={inputClass}
                placeholder="3001234567"
              />
              {errors.telefonoContacto && (
                <p className={errorClass}>{errors.telefonoContacto.message}</p>
              )}
            </div>
          </div>

          {/* Campos condicionales: cuenta bancaria */}
          {esCuentaBancaria && (
            <div className={sectionClass}>
              <p className="text-xs text-amber-400 font-medium mb-3">
                Datos requeridos para cuenta bancaria
              </p>

              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Entidad financiera</label>
                  <input
                    {...register('entidadFinanciera')}
                    className={inputClass}
                    placeholder="Bancolombia, Davivienda..."
                  />
                  {errors.entidadFinanciera && (
                    <p className={errorClass}>{errors.entidadFinanciera.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Tipo de cuenta</label>
                  <select {...register('tipoCuenta')} className={inputClass}>
                    <option value="AHORROS">Ahorros</option>
                    <option value="CORRIENTE">Corriente</option>
                  </select>
                  {errors.tipoCuenta && (
                    <p className={errorClass}>{errors.tipoCuenta.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Numero de cuenta</label>
                  <input
                    {...register('numeroCuenta')}
                    className={inputClass}
                    placeholder="1234567890"
                  />
                  {errors.numeroCuenta && (
                    <p className={errorClass}>{errors.numeroCuenta.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>
                    Certificado bancario
                    <span className="text-gray-500 font-normal ml-1">(preferiblemente PDF)</span>
                  </label>
                  <p className="text-[11px] text-gray-500 mb-1.5">
                    Adjunta el certificado de la cuenta emitido por el banco que acredita la
                    titularidad.
                  </p>
                  <Controller
                    name="certificadoCuenta"
                    control={control}
                    render={({ field: { onChange, ...field } }) => (
                      <label className="flex items-center justify-center gap-2 bg-gray-950 border border-white/10 rounded-xl px-4 py-5 text-sm text-gray-400 hover:border-indigo-500/30 cursor-pointer transition-colors">
                        <Upload size={16} />
                        {certFileName || 'Seleccionar archivo PDF, JPG o PNG (max 5 MB)'}
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => {
                            onChange(e.target.files);
                            setCertFileName(e.target.files?.[0]?.name || null);
                          }}
                        />
                      </label>
                    )}
                  />
                  {errors.certificadoCuenta && (
                    <p className={errorClass}>{(errors.certificadoCuenta as any)?.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* NEQUI / DAVIPLATA / OTRO */}
          {!esCuentaBancaria && (
            <div className={sectionClass}>
              <p className="text-xs text-amber-400 font-medium mb-3">
                Datos para {medioSeleccionado === 'NEQUI' ? 'Nequi' : medioSeleccionado === 'DAVIPLATA' ? 'Daviplata' : 'el medio de reembolso'}
              </p>

              <div>
                <label className={labelClass}>{getNumeroCuentaLabel(medioSeleccionado)}</label>
                <input
                  {...register('numeroCuenta')}
                  className={inputClass}
                  placeholder={medioSeleccionado === 'NEQUI' ? 'Ej. 3001234567' : ''}
                />
              </div>
            </div>
          )}

          {/* Observaciones */}
          <div>
            <label className={labelClass}>Observaciones (opcional)</label>
            <textarea
              {...register('observaciones')}
              className={inputClass}
              rows={2}
              placeholder="Informacion adicional que quieras compartir..."
            />
            {errors.observaciones && (
              <p className={errorClass}>{errors.observaciones.message}</p>
            )}
          </div>

          {/* Documento de identidad */}
          <div>
            <label className={labelClass}>
              Documento de identidad del titular
              <span className="text-gray-500 font-normal ml-1">(preferiblemente PDF)</span>
            </label>
            <p className="text-[11px] text-gray-500 mb-1.5">
              Adjunta el documento de identidad de la persona que realizo el pago. Debe ser el mismo
              titular de la cuenta registrada arriba.
            </p>
            <Controller
              name="documentoAdicional"
              control={control}
              render={({ field: { onChange, ...field } }) => (
                <label className="flex items-center justify-center gap-2 bg-gray-950 border border-white/10 rounded-xl px-4 py-5 text-sm text-gray-400 hover:border-indigo-500/30 cursor-pointer transition-colors">
                  <FileText size={16} />
                  {docFileName || 'Seleccionar archivo PDF, JPG o PNG (max 5 MB)'}
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      onChange(e.target.files);
                      setDocFileName(e.target.files?.[0]?.name || null);
                    }}
                  />
                </label>
              )}
            />
            {errors.documentoAdicional && (
              <p className={errorClass}>{(errors.documentoAdicional as any)?.message}</p>
            )}
          </div>

          {/* Info */}
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
            <p className="text-xs text-indigo-300">
              Estos datos seran enviados al organizador del evento para que pueda tramitar el reembolso
              por fuera de la plataforma. La plataforma no realiza devoluciones automaticas de dinero.
            </p>
            <p className="text-xs text-amber-400 mt-2">
              Verifica que la informacion sea correcta. Por seguridad, la plataforma solo guardara el
              numero de cuenta enmascarado.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2 sticky bottom-0 bg-gray-900 pb-2">
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
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              {isPending ? <Loader2 size={16} className="animate-spin" /> : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
