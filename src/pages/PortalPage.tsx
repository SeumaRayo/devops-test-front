import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../app/store/auth.store';
import { useNavigate } from 'react-router-dom';
import { useEventos } from '../features/eventos/hooks/useEventos';
import { useInscripcion } from '../features/eventos/hooks/useInscripcion';
import { EventoPublicoCard } from '../features/eventos/components/EventoPublicoCard';
import { StripeCheckoutDialog } from '../features/eventos/components/StripeCheckoutDialog';
import { Loader2 } from 'lucide-react';

const PortalPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Estados
  const { eventos, isLoading: isLoadingEventos, fetch: fetchEventos, error: errorEventos } = useEventos();
  const { mutate: inscribirse, isPending: isInscribiendo } = useInscripcion();
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [stripeConfig, setStripeConfig] = useState<{ isOpen: boolean; clientSecret: string }>({
    isOpen: false,
    clientSecret: '',
  });

  // Cargar eventos publicados y activos al montar el componente
  useEffect(() => {
    fetchEventos({ estadoEvento: 'PUBLICADO', estado: 'ACTIVO' });
  }, [fetchEventos]);

  // Revisar si venimos redirigidos por un pago exitoso de Stripe
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_intent') === 'success') {
      setSuccessMessage('¡Pago procesado exitosamente por Stripe! (El ticket se registrará como pagado).');
    }
  }, []);

  const handleInscripcion = (idEvento: number) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    inscribirse(idEvento, {
      onSuccess: (data) => {
        if (data.clientSecret) {
          // Evento de pago: Abrir modal de Stripe
          setStripeConfig({
            isOpen: true,
            clientSecret: data.clientSecret,
          });
        } else {
          // Evento gratuito
          setSuccessMessage(`¡Inscripción exitosa! Ticket GRATIS creado (ID: ${data.ticketId}).`);
        }
      },
      onError: (err: any) => {
        setErrorMessage(
          err.response?.data?.message || err.message || 'Error al intentar inscribirse.'
        );
      },
    });
  };

  const handlePaymentSuccess = () => {
    setStripeConfig({ isOpen: false, clientSecret: '' });
    setSuccessMessage('¡El pago ha sido validado correctamente!');
    // Recargar la página o estado para reflejar el éxito
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 pb-20">
      {/* HEADER PORTAL */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between mt-8 mb-12 bg-gray-900/30 border border-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Catálogo de Eventos</h1>
          <p className="text-gray-400">
            Bienvenido, <span className="text-blue-400 font-semibold">{user?.username}</span>. Explora los próximos eventos.
          </p>
        </div>
        <button
          onClick={() => {
            useAuthStore.getState().clearCredentials();
            navigate('/login');
          }}
          className="mt-4 md:mt-0 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/50 font-medium py-2 px-6 rounded-xl transition-all duration-300"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* MENSAJES DE ESTADO GLOBAL */}
      <div className="max-w-6xl mx-auto mb-6">
        {successMessage && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-4 rounded-xl font-medium shadow-lg animate-in fade-in slide-in-from-top-4">
            ✅ {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl font-medium shadow-lg animate-in fade-in slide-in-from-top-4">
            ❌ {errorMessage}
          </div>
        )}
        {errorEventos && (
          <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-6 py-4 rounded-xl font-medium shadow-lg">
            ⚠ {errorEventos}
          </div>
        )}
      </div>

      {/* LISTA DE EVENTOS */}
      <div className="max-w-6xl mx-auto">
        {isLoadingEventos ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
            <p>Cargando eventos disponibles...</p>
          </div>
        ) : eventos.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/20 border border-white/5 rounded-2xl">
            <p className="text-gray-400 text-lg">No hay eventos publicados en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.map((ev) => (
              <EventoPublicoCard
                key={ev.idEvento}
                evento={ev}
                onInscribirse={handleInscripcion}
                isPending={isInscribiendo}
              />
            ))}
          </div>
        )}
      </div>

      {/* STRIPE MODAL */}
      <StripeCheckoutDialog
        isOpen={stripeConfig.isOpen}
        clientSecret={stripeConfig.clientSecret}
        onClose={() => setStripeConfig({ isOpen: false, clientSecret: '' })}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default PortalPage;
