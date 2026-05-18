import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UsuarioCreateRequest } from '../types/usuario.types';

const schema = z.object({
  documento: z.string().min(1, 'El documento es requerido').max(20),
  nombres: z.string().min(1, 'Los nombres son requeridos'),
  apellidos: z.string().min(1, 'Los apellidos son requeridos'),
  genero: z.enum(['masculino', 'femenino'], { message: 'Selecciona un género válido' }),
  fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es requerida'),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  username: z.string().min(1, 'El username es requerido'),
  correoAcceso: z.string().email('Correo inválido'),
  claveAcceso: z.string().min(8, 'Mínimo 8 caracteres'),
});

type FormValues = z.infer<typeof schema>;

interface UsuarioFormProps {
  onSubmit: (data: UsuarioCreateRequest) => Promise<void>;
  isLoading?: boolean;
}

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60 focus:bg-white/[0.07]';
const labelClass = 'block text-xs font-medium text-gray-400 mb-1.5';
const errorClass = 'mt-1 text-xs text-red-400';

export const UsuarioForm: React.FC<UsuarioFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Documento</label>
          <input {...register('documento')} className={inputClass} placeholder="1234567890" />
          {errors.documento && <p className={errorClass}>{errors.documento.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Teléfono</label>
          <input {...register('telefono')} className={inputClass} placeholder="+57 300..." />
          {errors.telefono && <p className={errorClass}>{errors.telefono.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Nombres</label>
          <input {...register('nombres')} className={inputClass} placeholder="Juan Carlos" />
          {errors.nombres && <p className={errorClass}>{errors.nombres.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Apellidos</label>
          <input {...register('apellidos')} className={inputClass} placeholder="Pérez García" />
          {errors.apellidos && <p className={errorClass}>{errors.apellidos.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Género</label>
          <select {...register('genero')} className={inputClass}>
            <option value="">Seleccionar...</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
          {errors.genero && <p className={errorClass}>{errors.genero.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Fecha de Nacimiento</label>
          <input type="date" {...register('fechaNacimiento')} className={inputClass} />
          {errors.fechaNacimiento && <p className={errorClass}>{errors.fechaNacimiento.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Username</label>
          <input {...register('username')} className={inputClass} placeholder="jperez" />
          {errors.username && <p className={errorClass}>{errors.username.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Correo de Acceso</label>
          <input {...register('correoAcceso')} className={inputClass} placeholder="jperez@email.com" />
          {errors.correoAcceso && <p className={errorClass}>{errors.correoAcceso.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Contraseña</label>
          <input type="password" {...register('claveAcceso')} className={inputClass} placeholder="Mínimo 8 caracteres" />
          {errors.claveAcceso && <p className={errorClass}>{errors.claveAcceso.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : 'Crear Usuario'}
        </button>
      </div>
    </form>
  );
};
