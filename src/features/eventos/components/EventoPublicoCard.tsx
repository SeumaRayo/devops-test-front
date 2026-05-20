import React from 'react';
import { EventoResponse } from '../types/evento.types';
import { MapPin, Calendar, Clock, Loader2 } from 'lucide-react';

import { Link, useLocation } from 'react-router-dom';

interface Props {
  evento: EventoResponse;
}

export const EventoPublicoCard: React.FC<Props> = ({ evento }) => {
  const isFree = !evento.esDePago || evento.precio === 0;
  const location = useLocation();
  const basePath = location.pathname.startsWith('/dashboard') ? '/dashboard/portal' : '/portal';

  return (
    <div className="w-full bg-gray-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-1">
      <div>
        <h3 className="text-xl font-bold text-blue-400 mb-2">{evento.nombreEvento}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{evento.descripcionEvento}</p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center text-gray-300 text-sm">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            <span>{evento.fechaEvento}</span>
          </div>
          <div className="flex items-center text-gray-300 text-sm">
            <Clock className="w-4 h-4 mr-2 text-blue-500" />
            <span>{evento.horaEvento}</span>
          </div>
          <div className="flex items-center text-gray-300 text-sm">
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            <span className="truncate">{evento.lugarEvento}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto border-t border-white/10 pt-4">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Valor</span>
          {isFree ? (
            <span className="text-xl font-bold text-green-400">Gratis</span>
          ) : (
            <span className="text-xl font-bold text-white">
              ${evento.precio} {evento.moneda}
            </span>
          )}
        </div>

        <Link
          to={`${basePath}/eventos/${evento.idEvento}`}
          className={`flex items-center justify-center px-6 py-2.5 rounded-xl font-medium transition-colors bg-indigo-600 hover:bg-indigo-700 text-white`}
        >
          Ver Detalles
        </Link>
      </div>
    </div>
  );
};
