import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMisTickets, useCancelarTicket } from '../hooks/ticket.queries';
import { ticketService } from '../services/ticket.service';
import { TicketResponseDTO } from '../types/ticket.types';
import {
  Loader2, Ticket, XCircle, CheckCircle, Clock,
  CreditCard, Ban, ArrowLeft, CalendarDays, QrCode, X, Download,
} from 'lucide-react';
import { useAuthStore } from '../../../app/store/auth.store';

const estadoIcon = (estado: TicketResponseDTO['estadoTicket']) => {
  switch (estado) {
    case 'GRATIS':      return <CheckCircle size={14} />;
    case 'PAGADO':      return <CreditCard size={14} />;
    case 'PENDIENTE':   return <Clock size={14} />;
    case 'CANCELADO':   return <Ban size={14} />;
    case 'REEMBOLSADO': return <XCircle size={14} />;
    default: return null;
  }
};

const estadoStyle = (estado: TicketResponseDTO['estadoTicket']) => {
  switch (estado) {
    case 'GRATIS':      return 'text-green-400 bg-green-500/10 border-green-500/30';
    case 'PAGADO':      return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    case 'PENDIENTE':   return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    case 'CANCELADO':   return 'text-red-400 bg-red-500/10 border-red-500/30';
    case 'REEMBOLSADO': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    default:            return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  }
};

interface QrModalProps {
  ticket: TicketResponseDTO;
  onClose: () => void;
}

const QrModal: React.FC<QrModalProps> = ({ ticket, onClose }) => {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    let objectUrl: string;
    const fetchQr = async () => {
      try {
        objectUrl = await ticketService.getQrImageUrl(ticket.idTicket);
        setQrUrl(objectUrl);
      } catch (err: any) {
        setError(err.response?.data?.message || 'No se pudo cargar el código QR.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQr();
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [ticket.idTicket]);

  const handleDownload = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `ticket-${ticket.idTicket}-qr.png`;
    link.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-white/10 rounded-3xl p-8 shadow-2xl w-full max-w-sm animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Código QR del Ticket</h2>
            <p className="text-sm text-gray-400 truncate max-w-[200px]">{ticket.nombreEvento}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* QR Image */}
        <div className="flex justify-center mb-6">
          {isLoading ? (
            <div className="w-64 h-64 flex items-center justify-center bg-gray-800 rounded-2xl border border-white/5">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
            </div>
          ) : error ? (
            <div className="w-64 h-64 flex flex-col items-center justify-center bg-red-500/5 border border-red-500/20 rounded-2xl gap-3 p-4 text-center">
              <XCircle className="text-red-400" size={40} />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          ) : (
            <div className="p-3 bg-white rounded-2xl shadow-lg shadow-indigo-500/20">
              <img
                src={qrUrl!}
                alt={`QR Ticket #${ticket.idTicket}`}
                className="w-56 h-56 object-contain"
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="text-center space-y-1 mb-6">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Ticket</p>
          <p className="text-white font-mono text-lg font-bold">#{ticket.idTicket}</p>
          <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-medium ${estadoStyle(ticket.estadoTicket)}`}>
            {estadoIcon(ticket.estadoTicket)} {ticket.estadoTicket}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            disabled={!qrUrl}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors text-sm"
          >
            <Download size={16} /> Descargar PNG
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-3 rounded-xl transition-colors text-sm"
          >
            <X size={16} /> Cerrar
          </button>
        </div>

        <p className="text-center text-xs text-gray-600 mt-4">
          Muestra este QR en la entrada del evento
        </p>
      </div>
    </div>
  );
};

export default function MisTicketsPage() {
  const { user } = useAuthStore();

  const { data: tickets, isLoading, error } = useMisTickets();
  const { mutate: cancelar, isPending: isCancelling } = useCancelarTicket();

  const [cancelling, setCancelling] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [qrTicket, setQrTicket] = useState<TicketResponseDTO | null>(null);

  const handleCancelar = (id: number) => {
    if (!confirm('¿Estás seguro de que deseas cancelar este ticket? El cupo será devuelto al evento.')) return;
    setCancelling(id);
    setFeedback(null);
    cancelar(id, {
      onSuccess: () => {
        setFeedback({ type: 'success', msg: `Ticket #${id} cancelado. El cupo ha sido devuelto al evento.` });
        setCancelling(null);
      },
      onError: (err: any) => {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          'Error al cancelar el ticket.';
        setFeedback({ type: 'error', msg });
        setCancelling(null);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 pb-20">

      {/* ── HEADER ── */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between mt-8 mb-8 bg-gray-900/30 border border-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Ticket className="text-indigo-400" size={28} />
            Mis Tickets
          </h1>
          <p className="text-gray-400">
            Bienvenido, <span className="text-blue-400 font-semibold">{user?.username}</span>. Gestiona tus inscripciones.
          </p>
        </div>
        <Link
          to="/portal"
          className="mt-4 md:mt-0 flex items-center gap-2 bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 border border-white/10 font-medium py-2 px-5 rounded-xl transition-all duration-300"
        >
          <ArrowLeft size={16} />
          Volver al Catálogo
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">

        {/* Feedback banner */}
        {feedback && (
          <div
            className={`mb-6 px-5 py-4 rounded-xl border font-medium text-sm animate-in fade-in ${
              feedback.type === 'success'
                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {feedback.type === 'success' ? '✅' : '❌'} {feedback.msg}
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
            <p>Cargando tus tickets...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-400 bg-red-500/5 border border-red-500/10 rounded-2xl">
            Error al cargar los tickets. Intenta de nuevo más tarde.
          </div>
        ) : !tickets || tickets.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/20 border border-white/5 rounded-2xl">
            <Ticket className="mx-auto text-gray-700 mb-4" size={48} />
            <p className="text-gray-400 text-lg">Aún no tienes tickets.</p>
            <p className="text-gray-600 text-sm mt-1">¡Inscríbete a un evento para comenzar!</p>
            <Link
              to="/portal"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all"
            >
              <CalendarDays size={16} />
              Explorar eventos
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.idTicket}
                className="rounded-2xl border border-white/5 bg-gray-900/30 backdrop-blur-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-white/10 transition-all"
              >
                {/* Ticket info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-white font-semibold">{ticket.nombreEvento}</span>
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${estadoStyle(ticket.estadoTicket)}`}>
                      {estadoIcon(ticket.estadoTicket)}
                      {ticket.estadoTicket}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500">
                    <span>Ticket <span className="text-gray-400 font-mono">#{ticket.idTicket}</span></span>
                    <span>Evento <span className="text-gray-400 font-mono">#{ticket.idEvento}</span></span>
                    {ticket.montoPagado > 0 && (
                      <span className="text-blue-400 font-medium">Pagado: {ticket.montoPagado} {ticket.moneda}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">
                    Inscrito el{' '}
                    {new Date(ticket.creadoEn).toLocaleDateString('es-CO', {
                      day: '2-digit', month: 'long', year: 'numeric',
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Ver QR — only for active tickets */}
                  {(ticket.estadoTicket === 'GRATIS' || ticket.estadoTicket === 'PAGADO') && (
                    <button
                      onClick={() => setQrTicket(ticket)}
                      className="flex items-center gap-2 text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-2 rounded-xl hover:bg-indigo-500/20 transition-all"
                    >
                      <QrCode size={14} />
                      Ver QR
                    </button>
                  )}

                  {/* Cancel — only for active tickets */}
                  {(ticket.estadoTicket === 'GRATIS' || ticket.estadoTicket === 'PAGADO') && (
                    <button
                      onClick={() => handleCancelar(ticket.idTicket)}
                      disabled={isCancelling && cancelling === ticket.idTicket}
                      className="flex items-center gap-2 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-2 rounded-xl hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCancelling && cancelling === ticket.idTicket ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <XCircle size={12} />
                      )}
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Modal */}
      {qrTicket && (
        <QrModal ticket={qrTicket} onClose={() => setQrTicket(null)} />
      )}
    </div>
  );
}
