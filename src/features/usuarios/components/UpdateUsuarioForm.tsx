import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UsuarioUpdateRequest, UsuarioResponse, UsuarioCreatedResponse } from '../types/usuario.types';

const updateSchema = z.object({
  documento: z.string().min(1, 'El documento es requerido').max(20),
  nombres: z.string().min(1, 'Los nombres son requeridos'),
  apellidos: z.string().min(1, 'Los apellidos son requeridos'),
  genero: z.enum(['masculino', 'femenino'], { message: 'Selecciona un género válido' }),
  fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es requerida'),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  idRol: z.coerce.number().min(1, 'El rol es requerido'),
});

type UpdateFormValues = {
  documento: string;
  nombres: string;
  apellidos: string;
  genero: 'masculino' | 'femenino';
  fechaNacimiento: string;
  telefono: string;
  idRol: number;
};

interface UpdateUsuarioFormProps {
  initialData?: any; // The user data to prepopulate
  onSubmit: (data: UsuarioUpdateRequest) => Promise<void>;
  isLoading?: boolean;
}

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60 focus:bg-white/[0.07]';
const labelClass = 'block text-xs font-medium text-gray-400 mb-1.5';
const errorClass = 'mt-1 text-xs text-red-400';

export const UpdateUsuarioForm: React.FC<UpdateUsuarioFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const mapRol = (nombre: string) => {
    if (!nombre) return 1;
    const n = nombre.toUpperCase();
    if (n.includes('ADMIN')) return 2;
    if (n.includes('INVITADO')) return 3;
    return 1;
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateFormValues>({ 
    resolver: zodResolver(updateSchema as any),
    defaultValues: {
      documento: initialData?.documento || '',
      nombres: initialData?.nombres || '',
      apellidos: initialData?.apellidos || '',
      telefono: initialData?.telefono || '',
      genero: initialData?.genero || 'masculino',
      fechaNacimiento: initialData?.fechaNacimiento ? new Date(initialData.fechaNacimiento).toISOString().split('T')[0] : '',
      idRol: initialData?.nombreRol ? mapRol(initialData.nombreRol) : 1,
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        documento: initialData.documento || '',
        nombres: initialData.nombres || '',
        apellidos: initialData.apellidos || '',
        telefono: initialData.telefono || '',
        genero: initialData.genero || 'masculino',
        fechaNacimiento: initialData.fechaNacimiento ? new Date(initialData.fechaNacimiento).toISOString().split('T')[0] : '',
        idRol: initialData.nombreRol ? mapRol(initialData.nombreRol) : 1,
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
      {Object.keys(errors).length > 0 && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          <strong>Atención:</strong> Por favor corrige los errores resaltados para poder continuar. Algunos atributos (como Teléfono o Fecha) deben rellenarse porque el Backend los exige para actualizar.<br/>
          {Object.entries(errors).map(([key, err]: any) => (
             <span key={key} className="block ml-2">- {key}: {err.message}</span>
          ))}
        </div>
      )}
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
        <div className="sm:col-span-2">
          <label className={labelClass}>Asignación de Rol</label>
          <select {...register('idRol')} className={inputClass}>
            <option value={1}>USER (Usuario Base)</option>
            <option value={2}>ADMIN (Administrador)</option>
            <option value={3}>INVITADO (Invitado)</option>
          </select>
          {errors.idRol && <p className={errorClass}>{errors.idRol.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Guardando cambios...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
};
