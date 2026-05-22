import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { eventoService } from '../services/evento.service';
import { EventoResponse } from '../types/evento.types';
import { useInscribirEvento } from '../hooks/ticket.queries';
import { StripeCheckoutDialog } from '../components/StripeCheckoutDialog';
import { Loader2, ArrowLeft, Calendar, Clock, MapPin, Users, Ticket, CheckCircle, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

export default function PortalEventoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/dashboard') ? '/dashboard/portal' : '/portal';

  const [evento, setEvento] = useState<EventoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { mutate: inscribirse, isPending: isInscribiendo } = useInscribirEvento();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stripeConfig, setStripeConfig] = useState<{ isOpen: boolean; clientSecret: string }>({
    isOpen: false,
    clientSecret: '',
  });

  const fetchEvento = async () => {
    try {
      setIsLoading(true);
      const data = await eventoService.getDisponibleById(Number(id));
      setEvento(data);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('El evento no está disponible.');
      } else {
        setError(err.response?.data?.message || 'Error al cargar los detalles del evento.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEvento();
  }, [id]);

  const handleInscripcion = () => {
    if (!evento) return;
    setSuccessMessage(null);
    setErrorMessage(null);
    inscribirse(evento.idEvento, {
      onSuccess: (data) => {
        if (data.clientSecret) {
          setStripeConfig({ isOpen: true, clientSecret: data.clientSecret });
        } else {
          const ticketId = data.idTicket ?? data.ticketId;
          setSuccessMessage(`¡Inscripción exitosa! Ticket #${ticketId} creado.`);
        }
      },
      onError: (err: any) => {
        setErrorMessage(
          err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          'Error al intentar inscribirse.'
        );
      },
    });
  };

  const handlePaymentSuccess = () => {
    setStripeConfig({ isOpen: false, clientSecret: '' });
    setSuccessMessage('¡El pago ha sido validado correctamente!');
    fetchEvento();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-400 text-sm">Cargando detalles...</p>
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-400">{error ?? 'Evento no encontrado.'}</p>
        <Link to={basePath} className="text-sm text-indigo-400 hover:underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const isFree = !evento.esDePago || evento.precio === 0;

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
      <PageHeader
        title="Detalles del Evento"
        subtitle={evento.nombreEvento}
        action={
          <Link
            to={basePath}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/10"
          >
            <ArrowLeft size={16} /> Volver
          </Link>
        }
      />

      {successMessage && (
        <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 flex items-center gap-3">
          <CheckCircle size={18} className="shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-center gap-3">
          <AlertCircle size={18} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">{evento.nombreEvento}</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              {evento.descripcionEvento || 'Sin descripción disponible.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <DetailField label="Fecha" value={new Date(evento.fechaEvento + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })} />
            <DetailField label="Hora" value={`${evento.horaEvento.substring(0, 5)} hrs`} />
            <DetailField label="Lugar" value={evento.lugarEvento} />
            <DetailField label="Disponibilidad" value={`${evento.capacidadDisponible} / ${evento.capacidadMaxima} cupos`} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Valor de Ingreso</p>
            {isFree ? (
              <p className="text-2xl font-bold text-gray-300">Gratis</p>
            ) : (
              <p className="text-2xl font-bold text-white">${evento.precio} <span className="text-base text-gray-400">{evento.moneda}</span></p>
            )}
          </div>

          <button
            onClick={handleInscripcion}
            disabled={isInscribiendo || evento.capacidadDisponible === 0}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-colors ${
              evento.capacidadDisponible === 0
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isInscribiendo ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Ticket size={18} />
            )}
            {evento.capacidadDisponible === 0 ? 'Cupos Agotados' : 'Inscribirse'}
          </button>
        </div>
      </div>

      <StripeCheckoutDialog
        isOpen={stripeConfig.isOpen}
        clientSecret={stripeConfig.clientSecret}
        onClose={() => setStripeConfig({ isOpen: false, clientSecret: '' })}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

const DetailField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm font-medium text-white">{value}</p>
  </div>
);
