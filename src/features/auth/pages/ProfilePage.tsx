import React, { useEffect, useState } from 'react';
import { User, Clock, KeyRound } from 'lucide-react';
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
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 max-w-2xl">
      <div className="flex flex-col items-center py-10">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border-2 border-indigo-500/30 flex items-center justify-center mb-4">
          <User size={40} className="text-indigo-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">{profile.nombres} {profile.apellidos}</h1>
        <p className="text-sm text-gray-400">{profile.documento}</p>
        <span className={`mt-2 inline-block text-xs px-3 py-1 rounded-full font-medium ${profile.estado === 'ACTIVO' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
          {profile.estado || 'ACTIVO'}
        </span>
      </div>

      <div className="rounded-2xl border border-white/5 bg-gray-900/30 backdrop-blur-xl divide-y divide-white/5 mb-6">
        <Row label="ID Usuario" value={String(profile.idUsuario)} />
        <Row label="Documento" value={profile.documento} />
        {profile.telefono && <Row label="Teléfono" value={profile.telefono} />}
        {profile.genero && <Row label="Género" value={profile.genero.charAt(0).toUpperCase() + profile.genero.slice(1)} />}
        {profile.fechaNacimiento && <Row label="Fecha de Nacimiento" value={new Date(profile.fechaNacimiento + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })} />}
      </div>

      <div className="rounded-2xl border border-white/5 bg-gray-900/30 backdrop-blur-xl divide-y divide-white/5 mb-6">
        {lastSession ? (
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-gray-500" />
              <div>
                <p className="text-sm text-white">Última Sesión</p>
                <p className="text-xs text-gray-500 mt-0.5">{new Date(lastSession.fechaInicio).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${lastSession.activa ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>
              {lastSession.activa ? 'Activa' : 'Cerrada'}
            </span>
          </div>
        ) : (
          <div className="px-6 py-4 flex items-center gap-3 text-sm text-gray-500">
            <Clock size={18} />
            Sin sesiones registradas
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/5 bg-gray-900/30 backdrop-blur-xl mb-6">
        {showPasswordForm ? (
          <div className="p-6">
            <ChangePasswordForm />
          </div>
        ) : (
          <button
            onClick={() => setShowPasswordForm(true)}
            className="w-full px-6 py-4 flex items-center justify-between text-sm text-white hover:bg-white/5 transition-colors rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <KeyRound size={18} className="text-gray-500" />
              <span>Cambiar Contraseña</span>
            </div>
            <span className="text-gray-500">›</span>
          </button>
        )}
      </div>
    </div>
  );
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="px-6 py-4 flex items-center justify-between">
    <span className="text-sm text-gray-400">{label}</span>
    <span className="text-sm font-medium text-white">{value}</span>
  </div>
);
