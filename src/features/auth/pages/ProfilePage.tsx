import React, { useEffect, useState } from 'react';
import { User, Shield, Clock, Calendar } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { ChangePasswordForm } from '../../auth/components/ChangePasswordForm';
import { usuarioService } from '../../usuarios/services/usuario.service';
import { sesionService } from '../../sesiones/services/sesion.service';
import { UsuarioResponse } from '../../usuarios/types/usuario.types';
import { SesionResponseDto } from '../../sesiones/types/sesion.types';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UsuarioResponse | null>(null);
  const [lastSession, setLastSession] = useState<SesionResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const [userData, sessionData] = await Promise.all([
          usuarioService.getCurrentUser(),
          sesionService.getUltima().catch(() => null),
        ]);
        setProfile(userData);
        setLastSession(sessionData);
      } catch {
        setError('No se pudo cargar el perfil.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-400">{error ?? 'Perfil no encontrado.'}</p>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
      <PageHeader
        title="Mi Perfil"
        subtitle={`${profile.nombres} ${profile.apellidos}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <User size={24} className="text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {profile.nombres} {profile.apellidos}
                </h2>
                <p className="text-sm text-gray-400">{profile.nombreRol}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Documento" value={profile.documento} />
              <Field label="ID Usuario" value={String(profile.idUsuario)} />
              {profile.genero && <Field label="Género" value={profile.genero} />}
              {profile.telefono && <Field label="Teléfono" value={profile.telefono} />}
              {profile.fechaNacimiento && <Field label="Fecha de Nacimiento" value={profile.fechaNacimiento} />}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
            <ChangePasswordForm />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={20} className="text-indigo-400" />
              <h3 className="text-sm font-semibold text-gray-300">Rol y Permisos</h3>
            </div>
            <span className="inline-block rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-sm font-medium text-indigo-400">
              {profile.nombreRol}
            </span>
            <p className="text-xs text-gray-500 mt-3">Los permisos asociados a este rol determinan qué funcionalidades puedes ver y usar.</p>
          </div>

          {lastSession && (
            <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={20} className="text-indigo-400" />
                <h3 className="text-sm font-semibold text-gray-300">Última Sesión</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar size={14} />
                  <span>{new Date(lastSession.fechaInicio).toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500">Estado: {lastSession.activa ? 'Activa' : 'Cerrada'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm font-medium text-white">{value}</p>
  </div>
);

export default ProfilePage;
