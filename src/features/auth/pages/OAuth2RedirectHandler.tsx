import React from 'react';
import { Loader2 } from 'lucide-react';
import { useOAuth2Login } from '../hooks/useOAuth2Login';

export const OAuth2RedirectHandler = () => {
  // Toda la lógica y efectos están delegados a este custom hook
  useOAuth2Login();

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center items-center p-4">
      <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
      <h2 className="text-white text-xl font-medium">Procesando autenticación...</h2>
      <p className="text-gray-400 text-sm mt-2">Por favor espera un momento mientras validamos tus credenciales de acceso.</p>
    </div>
  );
};
