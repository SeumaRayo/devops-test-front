import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, CalendarDays, MonitorDot, Ticket, RefreshCcw } from 'lucide-react';
import { useAuthStore } from '../../../app/store/auth.store';
import { usuarioService } from '../../usuarios/services/usuario.service';
import { eventoService } from '../../eventos/services/evento.service';
import { sesionService } from '../../sesiones/services/sesion.service';

export default function GeneralDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState({ usuarios: 0, eventos: 0, sesiones: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usuarios, eventos, sesiones] = await Promise.all([
          usuarioService.getAll({ page: 0, size: 1 }).catch(() => null),
          eventoService.getAll({ page: 0, size: 1 }).catch(() => null),
          sesionService.getActivas(0, 1).catch(() => null),
        ]);
        setStats({
          usuarios: usuarios?.totalElements ?? 0,
          eventos: eventos?.totalElements ?? 0,
          sesiones: sesiones?.totalElements ?? 0,
        });
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 space-y-6">
      <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 md:p-8 backdrop-blur-xl">
        <h1 className="text-2xl font-bold text-white">Bienvenido, {user?.username}</h1>
        <p className="text-gray-400 mt-1 text-sm">Panel de administración del sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={Users}
          label="Usuarios"
          value={isLoading ? '...' : stats.usuarios.toLocaleString()}
          color="text-indigo-400"
          to="/dashboard/usuarios"
        />
        <StatCard
          icon={CalendarDays}
          label="Eventos"
          value={isLoading ? '...' : stats.eventos.toLocaleString()}
          color="text-emerald-400"
          to="/dashboard/eventos"
        />
        <StatCard
          icon={MonitorDot}
          label="Sesiones activas"
          value={isLoading ? '...' : stats.sesiones.toLocaleString()}
          color="text-amber-400"
          to="/dashboard/sesiones"
        />
      </div>

      <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Accesos Rápidos</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickLink to="/dashboard/usuarios" icon={Users} label="Usuarios" />
          <QuickLink to="/dashboard/eventos" icon={CalendarDays} label="Eventos" />
          <QuickLink to="/dashboard/accesos" icon={Ticket} label="Accesos" />
          <QuickLink to="/dashboard/sesiones" icon={MonitorDot} label="Sesiones" />
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon: Icon, label, value, color, to }: { icon: React.ElementType; label: string; value: string; color: string; to: string }) => (
  <Link to={to} className="rounded-2xl border border-white/5 bg-gray-900/30 p-5 backdrop-blur-xl hover:border-indigo-500/30 transition-all group">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
      <Icon size={20} className={`${color} opacity-60 group-hover:opacity-100 transition-opacity`} />
    </div>
    <span className="text-2xl font-bold text-white">{value}</span>
  </Link>
);

const QuickLink = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => (
  <Link
    to={to}
    className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/5 px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:border-indigo-500/30 transition-all"
  >
    <Icon size={18} className="text-indigo-400" />
    {label}
  </Link>
);
