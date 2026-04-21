import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Badge } from '../../../components/ui/Badge';
import { useEvento } from '../hooks/useEvento';

export default function EventoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { evento, historial, isLoading, error, fetchById } = useEvento();

  useEffect(() => {
    if (id) fetchById(Number(id));
  }, [id]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-gray-400 animate-pulse">Cargando evento...</div>;
  }

  if (error || !evento) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-400">{error ?? 'Evento no encontrado.'}</p>
        <button onClick={() => navigate(-1)} className="text-sm text-indigo-400 hover:underline">Volver</button>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 space-y-6">
      <PageHeader
        title="Detalle del Evento"
        subtitle={`ID: ${evento.idEvento}`}
        action={
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/10">
            <ArrowLeft size={16} /> Volver
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl space-y-5">
             <div className="flex items-start justify-between">
                <div>
                   <h2 className="text-2xl font-bold text-white">{evento.nombreEvento}</h2>
                   <p className="text-sm text-gray-400 mt-2">{evento.descripcionEvento || 'Sin descripción'}</p>
                </div>
                <Badge status={evento.estadoEvento} className="text-sm px-3 py-1" />
             </div>

             <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="flex gap-3 items-center">
                   <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                      <CalendarDays className="text-indigo-400" size={20} />
                   </div>
                   <div>
                      <p className="text-xs text-gray-500 uppercase">Fecha / Hora</p>
                      <p className="text-sm text-white font-medium">{evento.fechaEvento} - {evento.horaEvento}</p>
                   </div>
                </div>
                <div className="flex gap-3 items-center">
                   <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <MapPin className="text-emerald-400" size={20} />
                   </div>
                   <div>
                      <p className="text-xs text-gray-500 uppercase">Lugar</p>
                      <p className="text-sm text-white font-medium">{evento.lugarEvento}</p>
                   </div>
                </div>
             </div>
           </div>

           <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
             <h3 className="text-lg font-semibold text-white mb-4">Historial de Auditoría</h3>
             {historial.length === 0 ? (
               <p className="text-sm text-gray-500 text-center py-4">No hay registros en el historial.</p>
             ) : (
               <div className="space-y-4">
                 {historial.map(h => (
                   <div key={h.idHistorialEvento} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex flex-col items-center">
                         <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2"></div>
                         <div className="w-px h-full bg-white/10 my-1"></div>
                      </div>
                      <div className="flex-1">
                         <p className="text-sm text-white">Transición de <Badge status={h.estadoAnterior ?? 'N/A'}/> a <Badge status={h.estadoNuevo}/> </p>
                         {h.comentario && <p className="text-sm text-gray-400 mt-1 italic">"{h.comentario}"</p>}
                         <p className="text-xs text-gray-500 mt-2">
                           Por: <span className="text-indigo-400">{h.nombreUsuarioResponsable}</span> {' '}
                           el {new Date(String(h.fechaCambio)).toLocaleString()}
                         </p>
                      </div>
                   </div>
                 ))}
               </div>
             )}
           </div>
        </div>

        <div className="space-y-6">
           <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl space-y-4">
             <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Información Logística</h3>
             <div className="space-y-3 pt-2">
               <div>
                 <p className="text-xs text-gray-500">Capacidad Máxima</p>
                 <p className="text-sm text-white font-medium">{evento.capacidadMaxima} asistentes</p>
               </div>
               <div>
                 <p className="text-xs text-gray-500">Parqueadero</p>
                 <p className="text-sm text-white font-medium">{evento.tieneParqueadero ? `Sí (${evento.cuposParqueadero} cupos)` : 'No'}</p>
               </div>
               <div>
                 <p className="text-xs text-gray-500">Referencia de Ubicación</p>
                 <p className="text-sm text-white font-medium">{evento.referenciaUbicacion || 'N/A'}</p>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
