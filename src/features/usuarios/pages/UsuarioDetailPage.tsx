import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Badge } from '../../../components/ui/Badge';
import { StatusToggle } from '../../../components/ui/StatusToggle';
import { useUsuario } from '../hooks/useUsuario';

export default function UsuarioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, isLoading, error, fetchById, patchStatus } = useUsuario();

  useEffect(() => {
    if (id) fetchById(Number(id));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400 animate-pulse">
        Cargando usuario...
      </div>
    );
  }

  if (error || !usuario) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-400">{error ?? 'Usuario no encontrado.'}</p>
        <button onClick={() => navigate(-1)} className="text-sm text-indigo-400 hover:underline">
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
      <PageHeader
        title="Detalle de Usuario"
        subtitle={`${usuario.nombres} ${usuario.apellidos}`}
        action={
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/10"
          >
            <ArrowLeft size={16} />
            Volver
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info card */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <User size={24} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {usuario.nombres} {usuario.apellidos}
              </h2>
              <p className="text-sm text-gray-400">Doc: {usuario.documento}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <DetailField label="ID" value={String(usuario.idUsuario)} />
            <DetailField label="Rol" value={usuario.nombreRol} />
            <DetailField label="Documento" value={usuario.documento} />
          </div>
        </div>

        {/* Status card */}
        <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Estado</h3>
          <Badge status="ACTIVO" />
          <div className="pt-2">
            <p className="text-xs text-gray-500 mb-3">Cambiar estado:</p>
            <StatusToggle
              status="ACTIVO"
              onActivate={() => patchStatus(usuario.idUsuario, 'activar')}
              onDeactivate={() => patchStatus(usuario.idUsuario, 'desactivar')}
              onBlock={() => patchStatus(usuario.idUsuario, 'bloquear')}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const DetailField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm font-medium text-white">{value}</p>
  </div>
);
