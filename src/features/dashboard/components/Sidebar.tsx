import React, { useState } from 'react';
import { Menu, LogOut, LayoutDashboard, Settings, Users, Database } from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { NavItemType } from '../types/sidebar.types';
import { useLogout } from '../../auth/hooks/useLogout';

// Mock/Template para simular dinamismo
// En el futuro esto podría cargarse por API
const NAV_MENU: NavItemType[] = [
  {
    id: 'dashboard',
    title: 'Panel General',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    id: 'users',
    title: 'Gestión Usuarios',
    icon: Users,
    subModules: [
      { id: 'users-list', title: 'Listado Módulo', path: '/dashboard/users', icon: Database },
      { id: 'users-roles', title: 'Roles Submódulo', path: '/dashboard/users/roles', icon: Settings },
    ]
  },
  {
    id: 'settings',
    title: 'Configuración',
    icon: Settings,
    path: '/dashboard/options',
  }
];

export const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { logout } = useLogout();

  return (
    <aside className={`${isExpanded ? 'w-64' : 'w-[84px]'} h-screen bg-gray-900/50 backdrop-blur-3xl border-r border-white/10 flex flex-col transition-all duration-300 relative z-30`}>
      {/* Logos & Header Toggle */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 shrink-0 overflow-hidden">
        <div className={`font-bold text-xl tracking-widest text-white truncate transition-opacity duration-300 ${!isExpanded && 'opacity-0 w-0'}`}>
          DevOps<span className="text-indigo-500">App</span>
        </div>
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-400 hover:text-indigo-400 transition-colors p-1.5 rounded-lg hover:bg-white/5 shrink-0">
          <Menu size={22} />
        </button>
      </div>
      
      {/* Scrollable Nav Item Container */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 space-y-1 custom-scrollbar">
        <div className={`px-5 mb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider transition-opacity duration-300 ${!isExpanded && 'opacity-0'}`}>
          Menú Principal
        </div>
        {NAV_MENU.map((item) => (
          <SidebarItem key={item.id} item={item} isExpanded={isExpanded} />
        ))}
      </nav>

      {/* Footer / User Profile & Logout */}
      <div className="p-4 border-t border-white/5 shrink-0">
         <button 
           onClick={logout}
           className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:shadow-lg hover:shadow-red-500/10 transition-all font-medium border border-transparent hover:border-red-500/30 group ${!isExpanded && 'px-0'}`}
         >
           <LogOut size={20} className="group-hover:-translate-x-1 transition-transform shrink-0" />
           {isExpanded && <span className="truncate">Cerrar Sesión</span>}
         </button>
      </div>
    </aside>
  );
};
