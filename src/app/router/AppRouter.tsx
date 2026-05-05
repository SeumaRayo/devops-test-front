import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from '../../features/auth/pages/LoginPage';
import RegisterPage from '../../features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '../../features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../../features/auth/pages/ResetPasswordPage';
import { OAuth2RedirectHandler } from '../../features/auth/pages/OAuth2RedirectHandler';
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
import PortalPage from '../../features/eventos/pages/PortalPage';
import NotFoundPage from '../../pages/NotFoundPage';
import { ROLES } from '../../config/roles';

const RootRedirect = () => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (location.search.includes('authenticated=true')) {
    return <Navigate to={`/oauth2/redirect${location.search}`} replace />;
  }

  if (isAuthenticated) {
    if (user?.roles.includes(ROLES.ADMIN)) {
      return <Navigate to="/dashboard" replace />;
    }
    if (user?.roles.includes(ROLES.ORGANIZER)) {
      return <Navigate to="/dashboard/eventos" replace />;
    }
    return <Navigate to="/portal" replace />;
  }

  return <Navigate to="/login" replace />;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Portal Route (Non-admin default) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/portal" element={<PortalPage />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Permite a ADMIN y ORGANIZER entrar al layout del dashboard */}
        <Route element={<RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.ORGANIZER]} />}>
          <Route path="/dashboard" element={<DashboardLayout />}>

            {/* Rutas exclusivas de ADMIN */}
            <Route element={<RoleGuard allowedRoles={[ROLES.ADMIN]} />}>
              <Route index element={<GeneralDashboardPage />} />
              {/* Usuarios */}
              <Route path="usuarios" element={<UsuariosListPage />} />
              <Route path="usuarios/:id" element={<UsuarioDetailPage />} />
              {/* Accesos */}
              <Route path="accesos" element={<AccesosListPage />} />
              {/* Funcionalidades */}
              <Route path="funcionalidades" element={<FuncionalidadesListPage />} />
              {/* Sesiones */}
              <Route path="sesiones" element={<SesionesListPage />} />
            </Route>

            {/* Rutas compartidas (ADMIN y ORGANIZER) */}
            {/* Eventos */}
            <Route path="eventos" element={<EventosListPage />} />
            <Route path="eventos/historial" element={<EventosHistorialPage />} />
            <Route path="eventos/:id" element={<EventoDetailPage />} />

            {/* Fallback index para ROLE_ORGANIZER: redirige a eventos */}
            <Route element={<RoleGuard allowedRoles={[ROLES.ORGANIZER]} redirectTo="/unauthorized" />}>
              <Route index element={<Navigate to="/dashboard/eventos" replace />} />
            </Route>

          </Route>
        </Route>
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
