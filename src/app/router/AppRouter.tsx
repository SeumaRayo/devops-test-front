import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../../features/auth/pages/LoginPage';
import RegisterPage from '../../features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '../../features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../../features/auth/pages/ResetPasswordPage';
import { ProtectedRoute } from '../../features/auth/components/ProtectedRoute';
import { DashboardLayout } from '../../features/dashboard/layout/DashboardLayout';
import GeneralDashboardPage from '../../features/dashboard/pages/GeneralDashboardPage';
import UsuariosListPage from '../../features/usuarios/pages/UsuariosListPage';
import UsuarioDetailPage from '../../features/usuarios/pages/UsuarioDetailPage';
import AccesosListPage from '../../features/accesos/pages/AccesosListPage';
import EventosListPage from '../../features/eventos/pages/EventosListPage';
import EventoDetailPage from '../../features/eventos/pages/EventoDetailPage';
import EventosHistorialPage from '../../features/eventos/pages/EventosHistorialPage';
import FuncionalidadesListPage from '../../features/funcionalidades/pages/FuncionalidadesListPage';
import SesionesListPage from '../../features/sesiones/pages/SesionesListPage';
import { useAuthStore } from '../store/auth.store';
import { RoleGuard } from '../../components/common/RoleGuard';
import UnauthorizedPage from '../../pages/UnauthorizedPage';
import PortalPage from '../../pages/PortalPage';
import NotFoundPage from '../../pages/NotFoundPage';

const AppRouter = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      {/* Protected Portal Route (Non-admin default) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/portal" element={<PortalPage />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleGuard allowedRoles={['ROLE_ADMIN']} />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<GeneralDashboardPage />} />

            {/* Usuarios */}
            <Route path="usuarios" element={<UsuariosListPage />} />
            <Route path="usuarios/:id" element={<UsuarioDetailPage />} />

            {/* Accesos */}
            <Route path="accesos" element={<AccesosListPage />} />

            {/* Eventos */}
            <Route path="eventos" element={<EventosListPage />} />
            <Route path="eventos/historial" element={<EventosHistorialPage />} />
            <Route path="eventos/:id" element={<EventoDetailPage />} />

            {/* Funcionalidades */}
            <Route path="funcionalidades" element={<FuncionalidadesListPage />} />

            {/* Sesiones */}
            <Route path="sesiones" element={<SesionesListPage />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
