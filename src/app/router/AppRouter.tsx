import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../../features/auth/pages/LoginPage';
import RegisterPage from '../../features/auth/pages/RegisterPage';
import { ProtectedRoute } from '../../features/auth/components/ProtectedRoute';
import { DashboardLayout } from '../../features/dashboard/layout/DashboardLayout';
import GeneralDashboardPage from '../../features/dashboard/pages/GeneralDashboardPage';
import { useAuthStore } from '../store/auth.store';

const AppRouter = () => {
  // Solo la usamos para decidir la redirección en la raíz ("/")
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Rutas Privadas Protegidas / Dashboard */}
      <Route element={<ProtectedRoute />}>
         <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<GeneralDashboardPage />} />
            {/* Rutas Mocks para los módulos genéricos del menú */}
            <Route path="users" element={<div className="text-white text-3xl font-bold p-8 animate-in fade-in duration-500">Módulo: Listado de Usuarios 👥</div>} />
            <Route path="users/roles" element={<div className="text-white text-3xl font-bold p-8 animate-in fade-in duration-500">Submódulo: Seguridad y Roles 🔐</div>} />
            <Route path="options" element={<div className="text-white text-3xl font-bold p-8 animate-in fade-in duration-500">Módulo: Configuraciones del Sistema ⚙️</div>} />
         </Route>
      </Route>
    </Routes>
  );
}

export default AppRouter;
