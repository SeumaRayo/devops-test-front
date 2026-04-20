import React from 'react';
import { Activity, BarChart3, CreditCard, DollarSign, Users } from 'lucide-react';
import { useAuthStore } from '../../../app/store/auth.store';

export default function GeneralDashboardPage() {
  // Obtenemos los datos cacheados del store global sin tocar lógica de negocio aquí
  const user = useAuthStore(state => state.user);
  
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in slide-in-from-bottom-6 fade-in duration-500">
      
      {/* Encabezado Genérico */}
      <div className="flex justify-between items-center bg-gray-900/30 p-6 md:p-8 rounded-[2rem] border border-white/5 backdrop-blur-xl shadow-2xl">
        <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">¡Bienvenido de vuelta, {user?.username || 'Invitado'}!</h1>
           <p className="text-gray-400 mt-2 text-sm md:text-base">Aquí tienes tu panel maestro y el resumen operativo del sistema.</p>
        </div>
      </div>
      
      {/* Módulo de Resumen (Widgets) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <DashboardCard title="Ingresos Totales" value="$45,231.89" subtitle="+20.1% este mes" icon={DollarSign} color="text-emerald-400" />
         <DashboardCard title="Usuarios Activos" value="+2,350" subtitle="+180 registrados esta semana" icon={Users} color="text-indigo-400" />
         <DashboardCard title="Transacciones" value="+12,234" subtitle="+19% rendimiento" icon={CreditCard} color="text-amber-400" />
         <DashboardCard title="Carga Servidor" value="Normal" subtitle="0% picos de error" icon={Activity} color="text-rose-400" />
      </div>

       {/* Espacio para Módulo Complejo de Gráficos */}
       <div className="h-[400px] w-full bg-gray-900/30 border border-white/5 rounded-[2rem] backdrop-blur-xl shadow-2xl flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="text-gray-500 flex flex-col items-center gap-4 animate-pulse">
               <BarChart3 size={56} className="opacity-40" />
               <p className="font-medium tracking-wide">Espacio para Visualización de Datos Complejos</p>
            </div>
       </div>
    </div>
  );
};

// Componente Widget Reutilizable a nivel local
const DashboardCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
  <div className="bg-gray-900/30 p-6 rounded-3xl border border-white/5 backdrop-blur-xl hover:border-indigo-500/30 hover:bg-white/[0.02] shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group cursor-pointer relative overflow-hidden">
     <div className="absolute top-0 right-0 p-4 opacity-10 blur-xl transition-opacity group-hover:opacity-20 pointer-events-none">
       <Icon size={64} className={color} />
     </div>
     <div className="flex justify-between items-start relative z-10">
        <h3 className="text-sm font-semibold text-gray-400">{title}</h3>
        <Icon size={20} className={`${color} opacity-80 group-hover:opacity-100 transition-opacity`} />
     </div>
     <div className="mt-4 relative z-10">
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
        <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
     </div>
  </div>
);
