import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../../features/auth/pages/LoginPage';
import RegisterPage from '../../features/auth/pages/RegisterPage';
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

const AppRouter = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

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
    </Routes>
  );
};

export default AppRouter;
