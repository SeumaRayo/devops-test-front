import React, { useEffect, useState } from 'react';
import { User, Shield, Clock, Calendar, KeyRound, Mail, Phone, Hash } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { ChangePasswordForm } from '../../auth/components/ChangePasswordForm';
import { usuarioService } from '../../usuarios/services/usuario.service';
import { sesionService } from '../../sesiones/services/sesion.service';
import { UsuarioResponse } from '../../usuarios/types/usuario.types';
import { SesionResponseDto } from '../../sesiones/types/sesion.types';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UsuarioResponse | null>(null);
  const [lastSession, setLastSession] = useState<SesionResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

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
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <User size={28} className="text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {profile.nombres} {profile.apellidos}
                </h2>
                <p className="text-sm text-gray-400">ID: {profile.idUsuario}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <DetailField icon={<Hash size={14} />} label="ID Usuario" value={String(profile.idUsuario)} />
              <DetailField icon={<Hash size={14} />} label="Documento" value={profile.documento} />
              {profile.telefono && <DetailField icon={<Phone size={14} />} label="Teléfono" value={profile.telefono} />}
              {profile.genero && <DetailField icon={<User size={14} />} label="Género" value={profile.genero} />}
              {profile.fechaNacimiento && <DetailField icon={<Calendar size={14} />} label="Fecha de Nacimiento" value={profile.fechaNacimiento} />}
              <DetailField icon={<Shield size={14} />} label="Estado" value={profile.estado || 'ACTIVO'} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={18} className="text-indigo-400" />
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Estado</h3>
            </div>
            <span className={`inline-block rounded-lg px-3 py-1 text-sm font-medium ${profile.estado === 'ACTIVO' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-gray-500/10 border border-gray-500/20 text-gray-400'}`}>
              {profile.estado || 'ACTIVO'}
            </span>
          </div>

          {lastSession && (
            <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={18} className="text-indigo-400" />
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Última Sesión</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">{new Date(lastSession.fechaInicio).toLocaleString('es-CO')}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${lastSession.activa ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>
                  {lastSession.activa ? 'Activa' : 'Cerrada'}
                </span>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <KeyRound size={18} className="text-indigo-400" />
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Seguridad</h3>
            </div>
            {showPasswordForm ? (
              <ChangePasswordForm />
            ) : (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 transition-colors text-left flex items-center gap-2"
              >
                <KeyRound size={14} className="text-blue-400" />
                Cambiar Contraseña
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const DetailField = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div>
    <div className="flex items-center gap-1.5 mb-1">
      <span className="text-gray-500">{icon}</span>
      <span className="text-[11px] text-gray-500 uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-sm font-medium text-white">{value}</p>
  </div>
);
