import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, CalendarDays, Ticket, DollarSign, RefreshCcw, MonitorDot,
  TrendingUp, UserPlus, ArrowRight,
} from 'lucide-react';
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
        <p className="text-gray-400 mt-1 text-sm">Panel de administración — vista general del sistema.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard to="/dashboard/usuarios" icon={Users} label="Usuarios" value={stats?.totalUsuarios?.toLocaleString()} sub={`${stats?.usuariosActivos} activos`} color="indigo" />
        <StatCard to="/dashboard/eventos" icon={CalendarDays} label="Eventos" value={stats?.totalEventos?.toLocaleString()} sub={`${stats?.eventosPublicados} publicados`} color="emerald" />
        <StatCard to="/dashboard/mis-tickets" icon={Ticket} label="Tickets" value={stats?.totalTickets?.toLocaleString()} sub={`${stats?.ticketsVendidosHoy} hoy`} color="blue" />
        <StatCard to="#" icon={DollarSign} label="Ingresos" value={stats?.montoTotalPagos ? `$${(stats.montoTotalPagos / 1000).toFixed(0)}k` : '$0'} sub={`${stats?.totalPagos} transacciones`} color="amber" />
        <StatCard to="#" icon={RefreshCcw} label="Reembolsos" value={String(stats?.reembolsosPendientes ?? 0)} sub="pendientes" color="rose" />
        <StatCard to="/dashboard/sesiones" icon={MonitorDot} label="Sesiones" value={String(stats?.sesionesActivas ?? 0)} sub="activas" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-white/5 bg-gray-900/30 backdrop-blur-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                  <UserPlus size={15} className="text-indigo-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Últimos Usuarios</h3>
              </div>
              <Link to="/dashboard/usuarios" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                Ver todos <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {stats?.ultimosUsuarios?.map((u) => (
                <Link
                  key={u.idUsuario}
                  to={`/dashboard/usuarios/${u.idUsuario}`}
                  className="flex items-center justify-between px-6 py-3 hover:bg-white/3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-xs font-semibold text-indigo-300">
                      {u.nombres[0]}{u.apellidos[0]}
                    </div>
                    <div>
                      <p className="text-sm text-gray-200">{u.nombres} {u.apellidos}</p>
                      <p className="text-xs text-gray-500">#{u.idUsuario}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(u.fechaCreacion).toLocaleDateString('es-CO')}</span>
                </Link>
              ))}
              {(!stats?.ultimosUsuarios || stats.ultimosUsuarios.length === 0) && (
                <div className="px-6 py-8 text-center text-sm text-gray-500">No hay usuarios registrados aún.</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-white/5 bg-gray-900/30 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center">
                  <TrendingUp size={15} className="text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Próximos Eventos</h3>
              </div>
              <Link to="/dashboard/eventos" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                Ver todos <ArrowRight size={12} />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
              {stats?.proximosEventos?.map((e) => (
                <Link
                  key={e.idEvento}
                  to={`/dashboard/eventos/${e.idEvento}`}
                  className="shrink-0 w-36 h-36 rounded-2xl bg-emerald-600/10 border border-emerald-600/20 hover:bg-emerald-600/20 transition-colors flex flex-col items-center justify-center text-center p-3 gap-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center">
                    <CalendarDays size={22} className="text-emerald-400" />
                  </div>
                  <p className="text-xs text-gray-200 line-clamp-2 leading-tight">{e.nombreEvento}</p>
                  <span className="text-[11px] text-emerald-400 font-medium">
                    {new Date(e.fechaEvento + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                  </span>
                </Link>
              ))}
              {(!stats?.proximosEventos || stats.proximosEventos.length === 0) && (
                <div className="w-full py-8 text-center text-sm text-gray-500">No hay eventos programados.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ to, icon: Icon, label, value, sub, color }: {
  to: string;
  icon: React.ElementType;
  label: string;
  value?: string;
  sub: string;
  color: 'indigo' | 'emerald' | 'blue' | 'amber' | 'rose' | 'purple';
}) => {
  const colors = {
    indigo: { bg: 'bg-indigo-600/15', border: 'border-indigo-600/30', icon: 'text-indigo-400', text: 'text-indigo-300' },
    emerald: { bg: 'bg-emerald-600/15', border: 'border-emerald-600/30', icon: 'text-emerald-400', text: 'text-emerald-300' },
    blue: { bg: 'bg-blue-600/15', border: 'border-blue-600/30', icon: 'text-blue-400', text: 'text-blue-300' },
    amber: { bg: 'bg-amber-600/15', border: 'border-amber-600/30', icon: 'text-amber-400', text: 'text-amber-300' },
    rose: { bg: 'bg-rose-600/15', border: 'border-rose-600/30', icon: 'text-rose-400', text: 'text-rose-300' },
    purple: { bg: 'bg-purple-600/15', border: 'border-purple-600/30', icon: 'text-purple-400', text: 'text-purple-300' },
  };
  const c = colors[color];

  return (
    <Link
      to={to}
      className={`${c.bg} border ${c.border} rounded-2xl p-5 backdrop-blur-xl hover:scale-[1.03] transition-all duration-300 group`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} className={c.icon} />
        <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white tracking-tight">{value ?? '...'}</p>
      <p className={`text-xs mt-1 ${c.text}`}>{sub}</p>
    </Link>
  );
};
