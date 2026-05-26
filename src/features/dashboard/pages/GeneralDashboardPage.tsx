import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, CalendarDays, Ticket, DollarSign, RefreshCcw, MonitorDot, TrendingUp, UserPlus, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../../app/store/auth.store';
import { dashboardService } from '../services/dashboard.service';
import { DashboardStatsResponse } from '../types/dashboard.types';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

export default function GeneralDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStats().then(setStats).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-400 text-sm">Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 space-y-6">
      <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 md:p-8 backdrop-blur-xl">
        <h1 className="text-2xl font-bold text-white">Bienvenido, {user?.username}</h1>
        <p className="text-gray-400 mt-1 text-sm">Panel de administración del sistema.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard to="/dashboard/usuarios" icon={Users} label="Usuarios" value={stats?.totalUsuarios} sub={`${stats?.usuariosActivos ?? 0} activos`} color="text-indigo-400" />
        <StatCard to="/dashboard/eventos" icon={CalendarDays} label="Eventos" value={stats?.totalEventos} sub={`${stats?.eventosPublicados ?? 0} publicados`} color="text-emerald-400" />
        <StatCard to="/mis-tickets" icon={Ticket} label="Tickets" value={stats?.totalTickets} sub={`${stats?.ticketsVendidosHoy ?? 0} hoy`} color="text-blue-400" />
        <StatCard to="#" icon={DollarSign} label="Ingresos" value={stats?.montoTotalPagos ? `$${stats.montoTotalPagos.toLocaleString()}` : '$0'} sub={`${stats?.totalPagos ?? 0} pagos`} color="text-amber-400" />
        <StatCard to="#" icon={RefreshCcw} label="Reembolsos" value={stats?.reembolsosPendientes} sub="pendientes" color="text-rose-400" />
        <StatCard to="/dashboard/sesiones" icon={MonitorDot} label="Sesiones" value={stats?.sesionesActivas} sub="activas" color="text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats?.ultimosUsuarios && stats.ultimosUsuarios.length > 0 && (
          <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <UserPlus size={16} className="text-indigo-400" />
                Últimos Usuarios
              </h3>
              <Link to="/dashboard/usuarios" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                Ver todos <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-2">
              {stats.ultimosUsuarios.map((u) => (
                <Link key={u.idUsuario} to={`/dashboard/usuarios/${u.idUsuario}`} className="flex items-center justify-between rounded-lg bg-white/5 hover:bg-white/10 px-3 py-2 transition-colors">
                  <div>
                    <p className="text-sm text-gray-300">{u.nombres} {u.apellidos}</p>
                    <p className="text-xs text-gray-500">#{u.idUsuario}</p>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(u.fechaCreacion).toLocaleDateString('es-CO')}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {stats?.proximosEventos && stats.proximosEventos.length > 0 && (
          <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-400" />
                Próximos Eventos
              </h3>
              <Link to="/dashboard/eventos" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                Ver todos <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-2">
              {stats.proximosEventos.map((e) => (
                <Link key={e.idEvento} to={`/dashboard/eventos/${e.idEvento}`} className="flex items-center justify-between rounded-lg bg-white/5 hover:bg-white/10 px-3 py-2 transition-colors">
                  <div>
                    <p className="text-sm text-gray-300">{e.nombreEvento}</p>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(e.fechaEvento + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ to, icon: Icon, label, value, sub, color }: { to: string; icon: React.ElementType; label: string; value?: number | string; sub: string; color: string }) => (
  <Link to={to} className="rounded-xl border border-white/5 bg-gray-900/30 p-4 backdrop-blur-xl hover:border-indigo-500/30 transition-all group">
    <div className="flex items-center justify-between mb-2">
      <span className="text-[11px] text-gray-500 uppercase tracking-wider">{label}</span>
      <Icon size={16} className={`${color} opacity-50 group-hover:opacity-100 transition-opacity`} />
    </div>
    <p className="text-xl font-bold text-white">{value ?? '...'}</p>
    <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>
  </Link>
);
