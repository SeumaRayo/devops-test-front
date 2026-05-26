import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, CalendarDays, Ticket, DollarSign, RefreshCcw, MonitorDot,
  TrendingUp, UserPlus, ArrowRight, Activity,
} from 'lucide-react';
import { useAuthStore } from '../../../app/store/auth.store';
import { dashboardService } from '../services/dashboard.service';
import { DashboardStatsResponse } from '../types/dashboard.types';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

const colorMap = {
  indigo: { bg: 'from-indigo-500/10 to-indigo-600/5', border: 'border-indigo-500/20', icon: 'text-indigo-400', glow: 'shadow-indigo-500/10' },
  emerald: { bg: 'from-emerald-500/10 to-emerald-600/5', border: 'border-emerald-500/20', icon: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
  blue: { bg: 'from-blue-500/10 to-blue-600/5', border: 'border-blue-500/20', icon: 'text-blue-400', glow: 'shadow-blue-500/10' },
  amber: { bg: 'from-amber-500/10 to-amber-600/5', border: 'border-amber-500/20', icon: 'text-amber-400', glow: 'shadow-amber-500/10' },
  rose: { bg: 'from-rose-500/10 to-rose-600/5', border: 'border-rose-500/20', icon: 'text-rose-400', glow: 'shadow-rose-500/10' },
  purple: { bg: 'from-purple-500/10 to-purple-600/5', border: 'border-purple-500/20', icon: 'text-purple-400', glow: 'shadow-purple-500/10' },
};

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
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-gray-900/40 to-gray-900/20 p-8 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <h1 className="text-2xl font-bold text-white relative z-10">Bienvenido, {user?.username}</h1>
        <p className="text-gray-400 mt-1 text-sm relative z-10">Panel de administración — vista general del sistema.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          to="/dashboard/usuarios"
          icon={Users}
          label="Usuarios"
          value={stats?.totalUsuarios?.toLocaleString()}
          subtitle={`${stats?.usuariosActivos} activos`}
          colors={colorMap.indigo}
          trend="+"
        />
        <StatCard
          to="/dashboard/eventos"
          icon={CalendarDays}
          label="Eventos"
          value={stats?.totalEventos?.toLocaleString()}
          subtitle={`${stats?.eventosPublicados} publicados`}
          colors={colorMap.emerald}
        />
        <StatCard
          to="/mis-tickets"
          icon={Ticket}
          label="Tickets"
          value={stats?.totalTickets?.toLocaleString()}
          subtitle={`${stats?.ticketsVendidosHoy} hoy`}
          colors={colorMap.blue}
        />
        <StatCard
          to="#"
          icon={DollarSign}
          label="Ingresos"
          value={stats?.montoTotalPagos ? `$${(stats.montoTotalPagos / 1000).toFixed(0)}k` : '$0'}
          subtitle={`${stats?.totalPagos} transacciones`}
          colors={colorMap.amber}
        />
        <StatCard
          to="#"
          icon={RefreshCcw}
          label="Reembolsos"
          value={String(stats?.reembolsosPendientes ?? 0)}
          subtitle="pendientes"
          colors={colorMap.rose}
        />
        <StatCard
          to="/dashboard/sesiones"
          icon={MonitorDot}
          label="Sesiones"
          value={String(stats?.sesionesActivas ?? 0)}
          subtitle="activas ahora"
          colors={colorMap.purple}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <UserPlus size={14} className="text-indigo-400" />
              </div>
              Últimos Usuarios
            </h3>
            <Link to="/dashboard/usuarios" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-1">
            {stats?.ultimosUsuarios?.map((u, i) => (
              <Link
                key={u.idUsuario}
                to={`/dashboard/usuarios/${u.idUsuario}`}
                className="flex items-center justify-between rounded-xl hover:bg-white/5 px-4 py-3 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-medium text-indigo-400">
                    {u.nombres[0]}{u.apellidos[0]}
                  </div>
                  <div>
                    <p className="text-sm text-gray-200 group-hover:text-white transition-colors">{u.nombres} {u.apellidos}</p>
                    <p className="text-xs text-gray-500">#{u.idUsuario}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{new Date(u.fechaCreacion).toLocaleDateString('es-CO')}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <TrendingUp size={14} className="text-emerald-400" />
              </div>
              Próximos Eventos
            </h3>
            <Link to="/dashboard/eventos" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-1">
            {stats?.proximosEventos?.map((e) => (
              <Link
                key={e.idEvento}
                to={`/dashboard/eventos/${e.idEvento}`}
                className="flex items-center justify-between rounded-xl hover:bg-white/5 px-4 py-3 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CalendarDays size={14} className="text-emerald-400" />
                  </div>
                  <p className="text-sm text-gray-200 group-hover:text-white transition-colors">{e.nombreEvento}</p>
                </div>
                <span className="text-xs text-emerald-400 font-medium">
                  {new Date(e.fechaEvento + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  to: string;
  icon: React.ElementType;
  label: string;
  value?: string;
  subtitle: string;
  colors: typeof colorMap.indigo;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ to, icon: Icon, label, value, subtitle, colors, trend }) => (
  <Link
    to={to}
    className={`relative overflow-hidden rounded-2xl border ${colors.border} bg-gradient-to-br ${colors.bg} backdrop-blur-xl p-5 hover:scale-[1.02] hover:border-indigo-500/30 transition-all duration-300 group ${colors.glow}`}
  >
    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon size={40} className={colors.icon} />
    </div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</span>
        <Icon size={18} className={`${colors.icon} opacity-70 group-hover:opacity-100 transition-opacity`} />
      </div>
      <p className="text-2xl font-bold text-white tracking-tight">{value ?? '...'}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  </Link>
);
