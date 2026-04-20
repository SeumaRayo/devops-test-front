import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../../features/auth/pages/LoginPage';
import RegisterPage from '../../features/auth/pages/RegisterPage';
import { ProtectedRoute } from '../../features/auth/components/ProtectedRoute';
import { DashboardLayout } from '../../features/dashboard/layout/DashboardLayout';
import GeneralDashboardPage from '../../features/dashboard/pages/GeneralDashboardPage';
import { useAuthStore } from '../store/auth.store';

// Placeholder component for modules not yet developed
const ComingSoon = ({ module }: { module: string }) => (
  <div className="flex flex-col items-center justify-center h-64 gap-4 text-center animate-in fade-in duration-500">
    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
      <span className="text-2xl">🚧</span>
    </div>
    <div>
      <p className="text-lg font-semibold text-white">{module}</p>
      <p className="text-sm text-gray-400 mt-1">Este módulo está en desarrollo</p>
    </div>
  </div>
);

const AppRouter = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<GeneralDashboardPage />} />

          {/* Usuarios */}
          <Route path="usuarios" element={<ComingSoon module="Gestión de Usuarios" />} />
          <Route path="usuarios/:id" element={<ComingSoon module="Detalle de Usuario" />} />

          {/* Accesos */}
          <Route path="accesos" element={<ComingSoon module="Gestión de Accesos" />} />

          {/* Eventos */}
          <Route path="eventos" element={<ComingSoon module="Gestión de Eventos" />} />
          <Route path="eventos/historial" element={<ComingSoon module="Historial de Eventos" />} />
          <Route path="eventos/:id" element={<ComingSoon module="Detalle de Evento" />} />

          {/* Funcionalidades */}
          <Route path="funcionalidades" element={<ComingSoon module="Gestión de Funcionalidades" />} />

          {/* Sesiones */}
          <Route path="sesiones" element={<ComingSoon module="Gestión de Sesiones" />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
