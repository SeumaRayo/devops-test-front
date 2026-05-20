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
      <div className="min-h-screen bg-gray-950 flex justify-center items-center">
        <LoadingSpinner size="lg" text="Cargando detalles..." />
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className="min-h-screen bg-gray-950 p-4">
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">{error || 'Evento no encontrado'}</h2>
          <Link to={basePath} className="inline-block mt-4 text-indigo-400 hover:text-indigo-300 transition-colors">
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const isFree = !evento.esDePago || evento.precio === 0;

  return (
    <div className="min-h-screen bg-gray-950 p-4 pb-20">
      {/* ── HEADER ── */}
      <div className="max-w-5xl mx-auto mt-8 mb-4">
        <PageHeader 
          title="Detalles del Evento" 
          action={
            <Link
              to={basePath}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-gray-900/50 hover:bg-gray-800/50 px-4 py-2 rounded-xl border border-white/5"
            >
              <ArrowLeft size={16} /> Volver al catálogo
            </Link>
          }
        />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-4 rounded-xl font-medium shadow-lg flex items-start gap-3">
            <CheckCircle className="shrink-0 mt-0.5" size={20} />
            <div>
              <p>{successMessage}</p>
              <Link to="/mis-tickets" className="underline text-indigo-400 hover:text-indigo-300 text-sm mt-1 inline-block">
                Ver mis tickets →
              </Link>
            </div>
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl font-medium shadow-lg flex items-center gap-3">
            <AlertCircle className="shrink-0" size={20} />
            {errorMessage}
          </div>
        )}

        {/* Hero Card */}
        <div className="bg-gray-900/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Info Column (Left) */}
              <div className="flex-1 space-y-6">
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    {evento.nombreEvento}
                  </h1>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    {evento.descripcionEvento || 'Sin descripción disponible.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-y border-white/10">
                  <div className="flex items-center gap-4 bg-gray-950/50 p-4 rounded-xl border border-white/5">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <Calendar className="text-indigo-400" size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Fecha</p>
                      <p className="text-white font-medium">{new Date(evento.fechaEvento + 'T00:00:00').toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 bg-gray-950/50 p-4 rounded-xl border border-white/5">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                      <Clock className="text-amber-400" size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Hora</p>
                      <p className="text-white font-medium">{evento.horaEvento.substring(0, 5)} hrs</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-gray-950/50 p-4 rounded-xl border border-white/5">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <MapPin className="text-emerald-400" size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Lugar</p>
                      <p className="text-white font-medium break-words max-w-[150px]">{evento.lugarEvento}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-gray-950/50 p-4 rounded-xl border border-white/5">
                    <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0">
                      <Users className="text-pink-400" size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Disponibilidad</p>
                      <p className="text-white font-medium">{evento.capacidadDisponible} cupos</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Column (Right) */}
              <div className="w-full md:w-80 shrink-0 flex flex-col gap-4">
                <div className="bg-gray-950 border border-white/5 p-6 rounded-2xl text-center">
                  <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold mb-2">Valor de Ingreso</p>
                  {isFree ? (
                    <p className="text-3xl font-bold text-green-400">Gratis</p>
                  ) : (
                    <p className="text-3xl font-bold text-white">${evento.precio} <span className="text-lg text-gray-400">{evento.moneda}</span></p>
                  )}
                </div>

                <button
                  onClick={handleInscripcion}
                  disabled={isInscribiendo || evento.capacidadDisponible === 0}
                  className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                    evento.capacidadDisponible === 0
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : isInscribiendo
                      ? 'bg-indigo-600 text-white opacity-50 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1'
                  }`}
                >
                  {isInscribiendo ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Ticket className="w-6 h-6" />
                  )}
                  {evento.capacidadDisponible === 0 ? 'Cupos Agotados' : 'Inscribirse Ahora'}
                </button>
              </div>
            </div>
          </div>
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

