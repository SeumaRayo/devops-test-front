import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FuncionalidadRequest } from '../types/funcionalidad.types';

const schema = z.object({
  nombreFuncionalidad: z.string().min(1, 'El nombre es obligatorio').max(150),
  urlFuncionalidad: z.string().max(250).optional(),
  idPadre: z.number().nullable().optional(),
});

type FormValues = z.infer<typeof schema>;

interface FuncionalidadFormProps {
  onSubmit: (data: FuncionalidadRequest) => Promise<void>;
  isLoading?: boolean;
}

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60 focus:bg-white/[0.07]';
const labelClass = 'block text-xs font-medium text-gray-400 mb-1.5';
const errorClass = 'mt-1 text-xs text-red-400';

export const FuncionalidadForm: React.FC<FuncionalidadFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelClass}>Nombre de Funcionalidad</label>
        <input {...register('nombreFuncionalidad')} className={inputClass} placeholder="Ej. Gestión de Usuarios" />
        {errors.nombreFuncionalidad && <p className={errorClass}>{errors.nombreFuncionalidad.message}</p>}
      </div>

      <div>
        <label className={labelClass}>URL de Funcionalidad (Opcional)</label>
        <input {...register('urlFuncionalidad')} className={inputClass} placeholder="/admin/usuarios" />
        {errors.urlFuncionalidad && <p className={errorClass}>{errors.urlFuncionalidad.message}</p>}
      </div>

      <div>
        <label className={labelClass}>ID Padre (Opcional, para submenús)</label>
        <input 
          type="number" 
          {...register('idPadre', { setValueAs: v => v === "" ? null : Number(v) })} 
          className={inputClass} 
          placeholder="Dejar vacío si es raíz" 
        />
        {errors.idPadre && <p className={errorClass}>{errors.idPadre.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : 'Crear Funcionalidad'}
        </button>
      </div>
    </form>
  );
};
