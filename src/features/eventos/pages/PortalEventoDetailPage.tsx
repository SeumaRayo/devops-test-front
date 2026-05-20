import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { eventoService } from '../services/evento.service';
import { EventoResponse } from '../types/evento.types';
import { CheckoutPendienteResponse, EstadoInscripcion, InscripcionResponse, MiEstadoEventoResponse } from '../types/ticket.types';
import { ticketService } from '../services/ticket.service';
import { useInscribirEvento } from '../hooks/ticket.queries';
import { StripeCheckoutDialog } from '../components/StripeCheckoutDialog';
import { Loader2, ArrowLeft, Calendar, Clock, MapPin, Users, Ticket, CheckCircle, AlertCircle, X, DollarSign, CreditCard, QrCode, Download, RefreshCcw } from 'lucide-react';

interface ActiveCheckout {
  ticketId: number;
  clientSecret: string;
  expiraEn: string | number | null;
  expiresAtMs: number | null;
}

const resolveExpiresAtMs = (expiraEn?: string | number | null): number | null => {
  if (expiraEn === null || expiraEn === undefined) return null;

  if (typeof expiraEn === 'number') {
    if (expiraEn > 1_000_000_000_000) return expiraEn;
    if (expiraEn > 1_000_000_000) return expiraEn * 1000;
    return Date.now() + expiraEn * 1000;
  }

  const numericValue = Number(expiraEn);
  if (!Number.isNaN(numericValue)) return resolveExpiresAtMs(numericValue);

  const parsedDate = Date.parse(expiraEn);
  return Number.isNaN(parsedDate) ? null : parsedDate;
};

const toActiveCheckout = (
  data: CheckoutPendienteResponse | InscripcionResponse,
  fallback?: { ticketId?: number | null; expiraEn?: string | number | null }
): ActiveCheckout | null => {
  if (!data.clientSecret) return null;

  let ticketId: number | undefined;
  if ('ticketId' in data && data.ticketId) {
    ticketId = data.ticketId;
  } else if ('idTicket' in data) {
    ticketId = data.idTicket;
  } else if (fallback?.ticketId) {
    ticketId = fallback.ticketId;
  }

  const expiraEn = data.expiraEn ?? fallback?.expiraEn ?? null;
  if (!ticketId) return null;

  return {
    ticketId,
    clientSecret: data.clientSecret,
    expiraEn,
    expiresAtMs: resolveExpiresAtMs(expiraEn),
  };
};

const formatRemainingTime = (seconds: number | null): string => {
  if (seconds === null) return '--:--';

  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const PortalEventoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [evento, setEvento] = useState<EventoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { mutate: inscribirse, isPending: isInscribiendo } = useInscribirEvento();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [miEstado, setMiEstado] = useState<MiEstadoEventoResponse | null>(null);
  const [activeCheckout, setActiveCheckout] = useState<ActiveCheckout | null>(null);
  const [checkoutSecondsRemaining, setCheckoutSecondsRemaining] = useState<number | null>(null);
  const [isLoadingMiEstado, setIsLoadingMiEstado] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [hasExpiredCheckout, setHasExpiredCheckout] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isLoadingQr, setIsLoadingQr] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);
  const [stripeConfig, setStripeConfig] = useState<{ isOpen: boolean; clientSecret: string }>({
    isOpen: false,
    clientSecret: '',
  });

  // ===== CONFIRMATION DIALOG STATE =====
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

  const fetchCheckoutPendiente = async (
    fallback?: { ticketId?: number | null; expiraEn?: string | number | null }
  ) => {
    if (!id) return null;

    try {
      setIsLoadingCheckout(true);
      const data = await ticketService.getCheckoutPendiente(Number(id));
      const checkout = toActiveCheckout(data, fallback);
      setActiveCheckout(checkout);
      setHasExpiredCheckout(false);
      return checkout;
    } catch (err: any) {
      if (err.response?.status === 404) {
        setActiveCheckout(null);
        return null;
      }

      setErrorMessage(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        'No se pudo consultar el checkout pendiente.'
      );
      return null;
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  const fetchMiEstado = async () => {
    if (!id) return null;

    try {
      setIsLoadingMiEstado(true);
      const data = await ticketService.getMiEstadoEvento(Number(id));
      setMiEstado(data);

      if (data.estadoInscripcion === 'CHECKOUT_PENDIENTE') {
        await fetchCheckoutPendiente({
          ticketId: data.ticketId,
          expiraEn: data.expiraEn,
        });
      } else {
        setActiveCheckout(null);
        setStripeConfig({ isOpen: false, clientSecret: '' });
      }

      return data;
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        'No se pudo consultar tu estado de inscripcion.'
      );
      return null;
    } finally {
      setIsLoadingMiEstado(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEvento();
      fetchMiEstado();
    }
  }, [id]);

  useEffect(() => {
    if (!activeCheckout?.expiresAtMs) {
      setCheckoutSecondsRemaining(null);
      return;
    }

    const updateRemainingTime = () => {
      const seconds = Math.max(0, Math.ceil((activeCheckout.expiresAtMs! - Date.now()) / 1000));
      setCheckoutSecondsRemaining(seconds);
    };

    updateRemainingTime();
    const intervalId = window.setInterval(updateRemainingTime, 1000);

    return () => window.clearInterval(intervalId);
  }, [activeCheckout?.expiresAtMs]);

  useEffect(() => {
    if (checkoutSecondsRemaining !== 0 || !activeCheckout) return;

    setStripeConfig({ isOpen: false, clientSecret: '' });
    setActiveCheckout(null);
    setHasExpiredCheckout(true);
    fetchMiEstado();
  }, [checkoutSecondsRemaining, activeCheckout]);

  useEffect(() => {
    if (miEstado?.estadoInscripcion !== 'PAGO_EN_PROCESO') return;

    const intervalId = window.setInterval(() => {
      fetchMiEstado();
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [miEstado?.estadoInscripcion, id]);

  useEffect(() => {
    return () => {
      if (qrUrl) URL.revokeObjectURL(qrUrl);
    };
  }, [qrUrl]);

  const handleInscripcion = async () => {
    if (!evento) return;
    setSuccessMessage(null);
    setErrorMessage(null);

    if (miEstado?.estadoInscripcion === 'INSCRITO' || miEstado?.estadoInscripcion === 'PAGO_EN_PROCESO') {
      return;
    }

    if (miEstado?.estadoInscripcion === 'CHECKOUT_PENDIENTE' && !activeCheckout) {
      const checkout = await fetchCheckoutPendiente({
        ticketId: miEstado.ticketId,
        expiraEn: miEstado.expiraEn,
      });
      if (checkout) {
        setStripeConfig({ isOpen: true, clientSecret: checkout.clientSecret });
      }
      return;
    }

    if (activeCheckout) {
      setStripeConfig({ isOpen: true, clientSecret: activeCheckout.clientSecret });
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleCancelConfirmation = () => {
    setShowConfirmDialog(false);
  };

  const handleConfirmInscripcion = () => {
    if (!evento) return;
    setShowConfirmDialog(false);
    setSuccessMessage(null);
    setErrorMessage(null);
    inscribirse(evento.idEvento, {
      onSuccess: (data) => {
        const checkout = toActiveCheckout(data);

        if (checkout) {
          setActiveCheckout(checkout);
          setHasExpiredCheckout(false);
          setStripeConfig({ isOpen: true, clientSecret: checkout.clientSecret });
          fetchMiEstado();
        } else {
          const ticketId = data.idTicket ?? data.ticketId;
          queryClient.invalidateQueries({ queryKey: ['mis-tickets'] });
          fetchMiEstado();
          setSuccessMessage(`¡Inscripcion exitosa! Ticket #${ticketId} creado.`);
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

  const handleStripeClose = () => {
    setStripeConfig({ isOpen: false, clientSecret: '' });
  };

  const handlePaymentSuccess = () => {
    setStripeConfig({ isOpen: false, clientSecret: '' });
    setActiveCheckout(null);
    setHasExpiredCheckout(false);
    queryClient.invalidateQueries({ queryKey: ['mis-tickets'] });
    setSuccessMessage('¡El pago ha sido validado correctamente!');
    fetchEvento();
    fetchMiEstado();
  };

  const handleOpenQr = async () => {
    if (!miEstado?.ticketId) return;

    setIsQrOpen(true);
    setIsLoadingQr(true);
    setQrError(null);

    try {
      const url = await ticketService.getQrImageUrl(miEstado.ticketId);
      setQrUrl(url);
    } catch (err: any) {
      setQrError(err.response?.data?.message || 'No se pudo cargar el codigo QR.');
    } finally {
      setIsLoadingQr(false);
    }
  };

  const handleCloseQr = () => {
    if (qrUrl) URL.revokeObjectURL(qrUrl);
    setQrUrl(null);
    setIsQrOpen(false);
    setQrError(null);
  };

  const handleDownloadQr = () => {
    if (!qrUrl || !miEstado?.ticketId) return;

    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `ticket-${miEstado.ticketId}-qr.png`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className="min-h-screen bg-gray-950 p-4">
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">{error || 'Evento no encontrado'}</h2>
          <Link to="/portal" className="inline-block mt-4 text-indigo-400 hover:text-indigo-300 transition-colors">
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const isFree = !evento.esDePago || evento.precio === 0;
  const estadoInscripcion: EstadoInscripcion = miEstado?.estadoInscripcion ?? 'NO_INSCRITO';
  const isInscrito = estadoInscripcion === 'INSCRITO';
  const isCheckoutPendiente = estadoInscripcion === 'CHECKOUT_PENDIENTE';
  const isPagoEnProceso = estadoInscripcion === 'PAGO_EN_PROCESO';
  const isReintentoDisponible = estadoInscripcion === 'REINTENTO_DISPONIBLE';
  const canShowQr =
    isInscrito &&
    !!miEstado?.ticketId &&
    (miEstado.estadoTicket === 'PAGADO' || miEstado.estadoTicket === 'GRATIS');
  const isPrimaryButtonDisabled =
    isInscribiendo ||
    isLoadingCheckout ||
    isLoadingMiEstado ||
    isInscrito ||
    isPagoEnProceso ||
    evento.capacidadDisponible === 0;
  const primaryButtonLabel = isInscrito
    ? 'Ya estas inscrito'
    : isPagoEnProceso
      ? 'Validando pago'
      : isCheckoutPendiente
        ? 'Continuar pago'
        : isReintentoDisponible || hasExpiredCheckout
          ? 'Comprar de nuevo'
          : 'Inscribirse Ahora';

  return (
    <div className="min-h-screen bg-gray-950 p-4 pb-20">
      {/* ── HEADER ── */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mt-8 mb-8">
        <Link
          to="/portal"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Volver al catálogo
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
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
          <div className="p-8 md:p-12 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="space-y-4 flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  {evento.nombreEvento}
                </h1>
                <p className="text-lg text-gray-400 leading-relaxed">
                  {evento.descripcionEvento || 'Sin descripción disponible.'}
                </p>
              </div>
              <div className="shrink-0 bg-gray-950 border border-white/5 p-6 rounded-2xl text-center min-w-[200px]">
                <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold mb-2">Valor de Ingreso</p>
                {isFree ? (
                  <p className="text-3xl font-bold text-green-400">Gratis</p>
                ) : (
                  <p className="text-3xl font-bold text-white">${evento.precio} <span className="text-lg text-gray-400">{evento.moneda}</span></p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8 border-y border-white/10">
              <div className="flex items-center gap-4 bg-gray-950/50 p-4 rounded-xl border border-white/5">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Calendar className="text-indigo-400" size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Fecha</p>
                  <p className="text-white font-medium">{new Date(evento.fechaEvento + 'T00:00:00').toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-gray-950/50 p-4 rounded-xl border border-white/5">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Clock className="text-amber-400" size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Hora</p>
                  <p className="text-white font-medium">{evento.horaEvento.substring(0, 5)} hrs</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-gray-950/50 p-4 rounded-xl border border-white/5">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <MapPin className="text-emerald-400" size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Lugar</p>
                  <p className="text-white font-medium">{evento.lugarEvento}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-gray-950/50 p-4 rounded-xl border border-white/5">
                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                  <Users className="text-pink-400" size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Disponibilidad</p>
                  <p className="text-white font-medium">{evento.capacidadDisponible} cupos restantes</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <div className="w-full flex flex-col items-stretch sm:items-end gap-3">
                {isInscrito && (
                  <div className="w-full sm:w-auto bg-green-500/10 border border-green-500/20 text-green-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <CheckCircle size={16} />
                      Ya estas inscrito
                    </span>
                    {canShowQr && (
                      <button
                        type="button"
                        onClick={handleOpenQr}
                        className="inline-flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-100 px-3 py-2 rounded-lg transition-colors"
                      >
                        <QrCode size={14} />
                        Ver QR
                      </button>
                    )}
                  </div>
                )}

                {isPagoEnProceso && (
                  <div className="w-full sm:w-auto bg-blue-500/10 border border-blue-500/20 text-blue-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <Loader2 size={16} className="animate-spin" />
                      Estamos validando tu pago
                    </span>
                    <button
                      type="button"
                      onClick={fetchMiEstado}
                      className="inline-flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-100 px-3 py-2 rounded-lg transition-colors"
                    >
                      <RefreshCcw size={14} />
                      Actualizar
                    </button>
                  </div>
                )}

                {isCheckoutPendiente && activeCheckout && (
                  <div className="w-full sm:w-auto bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <Clock size={16} />
                      Pago pendiente
                    </span>
                    <span className="text-yellow-100">
                      Ticket #{activeCheckout.ticketId} expira en {formatRemainingTime(checkoutSecondsRemaining)}
                    </span>
                  </div>
                )}

                <button
                  onClick={handleInscripcion}
                  disabled={isPrimaryButtonDisabled}
                  className={`flex items-center justify-center gap-3 px-10 py-4 rounded-xl font-bold text-lg transition-all ${
                    isPrimaryButtonDisabled
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1'
                  }`}
                >
                  {isInscribiendo || isLoadingCheckout || isLoadingMiEstado ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : isCheckoutPendiente ? (
                    <CreditCard className="w-6 h-6" />
                  ) : isInscrito ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Ticket className="w-6 h-6" />
                  )}
                  {evento.capacidadDisponible === 0 && !isInscrito ? 'Cupos Agotados' : primaryButtonLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CONFIRMATION DIALOG ===== */}
      {showConfirmDialog && evento && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleCancelConfirmation}
        >
          <div
            className="bg-gray-900 border border-white/10 rounded-3xl p-8 shadow-2xl w-full max-w-md animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Ticket className="text-indigo-400" />
                Confirmar inscripcion
              </h2>
              <button onClick={handleCancelConfirmation} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="bg-gray-800/50 border border-white/5 rounded-xl p-4 mb-4 space-y-2">
              <p className="text-white font-semibold">{evento.nombreEvento}</p>
              <p className="text-sm text-gray-400">
                {evento.lugarEvento} &middot;{' '}
                {new Date(evento.fechaEvento + 'T00:00:00').toLocaleDateString('es-CO', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <DollarSign size={16} className="text-gray-500" />
                {isFree ? (
                  <span className="text-green-400 font-bold text-lg">Gratis</span>
                ) : (
                  <span className="text-white font-bold text-lg">
                    ${evento.precio} {evento.moneda}
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-6">
              {isFree
                ? 'Al confirmar, quedaras inscrito de inmediato con un ticket GRATIS.'
                : 'Al confirmar, seras redirigido a la pasarela de pago seguro de Stripe.'}
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelConfirmation}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmInscripcion}
                disabled={isInscribiendo}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                {isInscribiendo ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isFree ? (
                  'Confirmar inscripcion'
                ) : (
                  'Ir a pagar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isQrOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleCloseQr}
        >
          <div
            className="bg-gray-900 border border-white/10 rounded-3xl p-8 shadow-2xl w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Codigo QR del ticket</h2>
                <p className="text-sm text-gray-400">Ticket #{miEstado?.ticketId}</p>
              </div>
              <button onClick={handleCloseQr} className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex justify-center mb-6">
              {isLoadingQr ? (
                <div className="w-64 h-64 flex items-center justify-center bg-gray-800 rounded-2xl border border-white/5">
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
                </div>
              ) : qrError ? (
                <div className="w-64 h-64 flex flex-col items-center justify-center bg-red-500/5 border border-red-500/20 rounded-2xl gap-3 p-4 text-center">
                  <AlertCircle className="text-red-400" size={40} />
                  <p className="text-red-400 text-sm">{qrError}</p>
                </div>
              ) : qrUrl ? (
                <div className="p-3 bg-white rounded-2xl shadow-lg shadow-indigo-500/20">
                  <img
                    src={qrUrl}
                    alt={`QR Ticket #${miEstado?.ticketId}`}
                    className="w-56 h-56 object-contain"
                  />
                </div>
              ) : null}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownloadQr}
                disabled={!qrUrl}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors text-sm"
              >
                <Download size={16} />
                Descargar
              </button>
              <button
                onClick={handleCloseQr}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-3 rounded-xl transition-colors text-sm"
              >
                <X size={16} />
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <StripeCheckoutDialog
        isOpen={stripeConfig.isOpen}
        clientSecret={stripeConfig.clientSecret}
        onClose={handleStripeClose}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default PortalEventoDetailPage;
