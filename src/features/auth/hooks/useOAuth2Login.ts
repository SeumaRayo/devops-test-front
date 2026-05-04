import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../app/store/auth.store';
import { extractRoles } from '../../../utils/jwt.utils';
import { authService } from '../services/auth.service';
import { ROLES } from '../../../config/roles';

export const useOAuth2Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setCredentials = useAuthStore((state) => state.setCredentials);

  useEffect(() => {
    // Extraer parámetros de la URL enviados por el backend post-autorización
    const urlParams = new URLSearchParams(location.search);
    const authenticated = urlParams.get('authenticated');
    const error = urlParams.get('error');

    if (authenticated === 'true') {
      // Backend nos avisa que la sesión OAuth2 fue exitosa.
      // Ahora pedimos el JWT verdadero al endpoint de éxito
      const fetchToken = async () => {
        try {
          const res = await authService.getOAuth2Success();
          if (res.token) {
            setCredentials(res.token, { username: res.username || 'Usuario OAuth' });
            // RootRedirect en AppRouter.tsx se encarga del enrutamiento por rol
            navigate('/', { replace: true });
          } else {
            throw new Error('No se recibió token en la respuesta');
          }
        } catch (err) {
          navigate('/login', { 
            replace: true, 
            state: { error: 'No se pudo obtener las credenciales de sesión OAuth.' } 
          });
        }
      };

      fetchToken();
    } else if (error || location.search.length > 0) {
      // Retornar al login si falla la provisión
      navigate('/login', { 
        replace: true, 
        state: { error: error || 'Falló la autenticación con el proveedor externo.' } 
      });
    } else {
      // Si llega sin parámetros a /oauth2/redirect, mandar a login
      navigate('/login', { replace: true });
    }
  }, [location, navigate, setCredentials]);
};
