import { Routes, Route, Link } from 'react-router-dom';
import LoginPage from '../../features/auth/pages/LoginPage';
import RegisterPage from '../../features/auth/pages/RegisterPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={
        <div className="flex flex-col h-screen items-center justify-center bg-gray-900 space-y-4">
          <h1 className="text-3xl font-bold text-white tracking-widest">¡Bienvenido a DevOps Frontend!</h1>
          <Link to="/login" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors">
            Ir al Login
          </Link>
        </div>
      } />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default AppRouter;
