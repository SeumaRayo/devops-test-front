import React from 'react';
import { EventoResponse } from '../types/evento.types';
import { MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  evento: EventoResponse;
  yaInscrito?: boolean;
}

export const EventoPublicoCard: React.FC<Props> = ({ evento, yaInscrito = false }) => {
  const isFree = !evento.esDePago || evento.precio === 0;

  return (
    <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 relative">
      {yaInscrito && (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle size={12} />
          Ya inscrito
        </span>
      )}
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
          to={`/portal/eventos/${evento.idEvento}`}
          className={`flex items-center justify-center px-6 py-2.5 rounded-xl font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white`}
        >
          Ver Detalles
        </Link>
      </div>
    </div>
  );
};
