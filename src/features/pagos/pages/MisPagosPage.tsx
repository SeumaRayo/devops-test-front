import React from 'react';
import { Link } from 'react-router-dom';
import { useMisPagos } from '../hooks/pago.queries';
import { PagoResponse } from '../types/pago.types';
import {
  Loader2, CreditCard, ArrowLeft, CalendarDays,
  CheckCircle, XCircle, Clock, Receipt
} from 'lucide-react';
import { useAuthStore } from '../../../app/store/auth.store';

const estadoIcon = (estadoPago: PagoResponse['estadoPago']) => {
  switch (estadoPago) {
    case 'EXITOSO': return <CheckCircle size={14} />;
    case 'FALLIDO': return <XCircle size={14} />;
    case 'PENDIENTE': return <Clock size={14} />;
    default: return null;
  }
};

const estadoStyle = (estadoPago: PagoResponse['estadoPago']) => {
  switch (estadoPago) {
    case 'EXITOSO': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    case 'FALLIDO': return 'text-red-400 bg-red-500/10 border-red-500/30';
    case 'PENDIENTE': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  }
};

const MisPagosPage: React.FC = () => {
  const { user } = useAuthStore();
  const { data: pagos, isLoading, error } = useMisPagos();

  return (
    <div className="min-h-screen bg-gray-950 p-4 pb-20">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between mt-8 mb-8 bg-gray-900/30 border border-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <CreditCard className="text-indigo-400" size={28} />
            Mis Pagos
          </h1>
          <p className="text-gray-400">
            Historial de transacciones de tus compras y devoluciones.
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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
            <p>Cargando tu historial de pagos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-400 bg-red-500/5 border border-red-500/10 rounded-2xl">
            Error al cargar el historial de pagos. Intenta de nuevo más tarde.
          </div>
        ) : !pagos || pagos.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/20 border border-white/5 rounded-2xl">
            <Receipt className="mx-auto text-gray-700 mb-4" size={48} />
            <p className="text-gray-400 text-lg">Aún no tienes pagos registrados.</p>
            <Link
              to="/portal"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all"
            >
              <CalendarDays size={16} />
              Explorar eventos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pagos.map((pago) => (
              <div key={pago.idPago} className="rounded-2xl border border-white/5 bg-gray-900/30 backdrop-blur-xl p-5 hover:border-white/10 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                        pago.tipoPago === 'COBRO' 
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {pago.tipoPago}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${estadoStyle(pago.estadoPago)}`}>
                        {estadoIcon(pago.estadoPago)}
                        {pago.estadoPago}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <span className="text-2xl font-bold text-white">
                        {pago.tipoPago === 'REEMBOLSO' ? '+' : ''}
                        {pago.monto.toLocaleString('en-US', { style: 'currency', currency: pago.moneda })}
                      </span>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-1">
                        <span>Pago <span className="text-gray-400 font-mono">#{pago.idPago}</span></span>
                        <span>Ticket <span className="text-gray-400 font-mono">#{pago.idTicket}</span></span>
                        <span>Evento <span className="text-gray-400 font-mono">#{pago.eventoId}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right flex flex-col gap-2">
                    <div className="text-xs text-gray-400">
                      {new Date(pago.creadoEn).toLocaleString('es-CO', {
                        day: '2-digit', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                    
                    {pago.stripeChargeId && (
                      <div className="text-xs text-gray-600 bg-black/20 p-2 rounded-lg break-all">
                        <span className="text-gray-500 uppercase">Stripe ID: </span>
                        {pago.stripeChargeId}
                      </div>
                    )}
                    {pago.stripeRefundId && (
                      <div className="text-xs text-emerald-600/80 bg-emerald-500/5 p-2 rounded-lg break-all">
                        <span className="uppercase">Refund ID: </span>
                        {pago.stripeRefundId}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisPagosPage;
