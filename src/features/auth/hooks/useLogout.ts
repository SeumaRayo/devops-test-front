import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../app/store/auth.store';
import { useCallback } from 'react';

export const useLogout = () => {
  const navigate = useNavigate();
  const clearCredentials = useAuthStore(state => state.clearCredentials);

  const logout = useCallback(async () => {
    // Si hubiera endpoint para invalidar sesion desde Backend, se ejecutaría aquí.
    
    // Limpiamos la caché persistida asincrónica y la memoria temporal.
    clearCredentials();
    
    // Redirigimos sin historia para evitar ir "atrás" a rutas protegidas.
    navigate('/login', { replace: true });
  }, [clearCredentials, navigate]);

  return { logout };
};
