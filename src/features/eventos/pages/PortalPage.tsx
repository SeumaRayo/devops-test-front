import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../app/store/auth.store';
import { useNavigate, Link } from 'react-router-dom';
import { useEventos } from '../hooks/useEventos';
import { EventoPublicoCard } from '../components/EventoPublicoCard';
import { eventoService } from '../services/evento.service';
import { Loader2, Search, SlidersHorizontal, X, Ticket, QrCode } from 'lucide-react';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

const PortalPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const {
    eventos,
    isLoading: isLoadingEventos,
    fetch: fetchEventos,
    applyFilters,
    error: errorEventos,
  } = useEventos('disponibles');

  const [searchNombre, setSearchNombre] = useState('');
  const [searchLugar, setSearchLugar] = useState('');
  const [filterPago, setFilterPago] = useState<'' | 'true' | 'false'>('');
  const [filterCupos, setFilterCupos] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    fetchEventos();

    // Check if the user is staff for any event
    const checkStaff = async () => {
      try {
        const isStaff = await eventoService.tieneAsignacionesStaff();
        setIsStaff(isStaff);
      } catch {
        // ignore
      }
    };
    checkStaff();
  }, [fetchEventos]);

  const handleSearch = () => {
    applyFilters({
      nombre: searchNombre || undefined,
      lugar: searchLugar || undefined,
      esDePago: filterPago === '' ? undefined : filterPago === 'true',
      conCupos: filterCupos || undefined,
    });
  };

  const handleClearFilters = () => {
    setSearchNombre('');
    setSearchLugar('');
    setFilterPago('');
    setFilterCupos(false);
    fetchEventos();
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 pb-20">

      {/* ── HEADER (same style as original) ── */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between mt-8 mb-8 bg-gray-900/30 border border-white/10 backdrop-blur-xl p-4 md:p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Catálogo de Eventos</h1>
          <p className="text-gray-400">
            Bienvenido, <span className="text-blue-400 font-semibold">{user?.username}</span>. Explora los próximos eventos.
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          {isStaff ? (
            <Link
              to="/asignaciones"
              className="flex items-center gap-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-medium py-2 px-5 rounded-xl transition-all duration-300"
            >
              <QrCode size={16} />
              Panel Staff
            </Link>
          ) : (
            <button
              disabled
              title="Aún no has sido seleccionado como staff en ningún evento"
              className="flex items-center gap-2 bg-gray-800/30 text-gray-500 border border-gray-700/50 font-medium py-2 px-5 rounded-xl cursor-not-allowed"
            >
              <QrCode size={16} />
              Panel Staff
            </button>
          )}
          <Link
            to="/mis-tickets"
            className="flex items-center gap-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-medium py-2 px-5 rounded-xl transition-all duration-300"
          >
            <Ticket size={16} />
            Mis Tickets
          </Link>
          <button
            onClick={() => {
              useAuthStore.getState().clearCredentials();
              navigate('/login');
            }}
            className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/50 font-medium py-2 px-6 rounded-xl transition-all duration-300"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* ── SEARCH & FILTER BAR ── */}
      <div className="max-w-6xl mx-auto mb-6 bg-gray-900/30 border border-white/10 rounded-2xl p-4 space-y-3 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-center gap-3 w-full">
          <div className="w-full md:flex-1 min-w-[180px] flex items-center gap-2 bg-gray-900/60 border border-white/10 rounded-xl px-3 py-2">
            <Search size={14} className="text-gray-500 shrink-0" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchNombre}
              onChange={(e) => setSearchNombre(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all ${
                showFilters
                  ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30'
                  : 'text-gray-400 border-white/10 hover:bg-white/5'
              }`}
            >
              <SlidersHorizontal size={14} />
              Filtros
            </button>
            <button
              onClick={handleSearch}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shrink-0"
            >
              Buscar
            </button>
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors shrink-0"
            >
              <X size={12} /> Limpiar
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-col md:flex-row flex-wrap gap-3 pt-4 mt-2 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-200 w-full">
            <div className="w-full md:flex-1 min-w-[160px] flex items-center gap-2 bg-gray-900/60 border border-white/10 rounded-xl px-3 py-2">
              <Search size={14} className="text-gray-500 shrink-0" />
              <input
                type="text"
                placeholder="Lugar..."
                value={searchLugar}
                onChange={(e) => setSearchLugar(e.target.value)}
                className="bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none w-full"
              />
            </div>
            <select
              value={filterPago}
              onChange={(e) => setFilterPago(e.target.value as '' | 'true' | 'false')}
              className="w-full md:w-auto bg-gray-900/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 outline-none"
            >
              <option value="">Todos (gratis y de pago)</option>
              <option value="false">Solo gratuitos</option>
              <option value="true">Solo de pago</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filterCupos}
                onChange={(e) => setFilterCupos(e.target.checked)}
                className="accent-indigo-500 w-4 h-4"
              />
              Con cupos disponibles
            </label>
          </div>
        )}
      </div>

      {/* ── STATUS MESSAGES ── */}
      <div className="max-w-6xl mx-auto mb-6 space-y-3">
        {errorEventos && (
          <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-6 py-4 rounded-xl font-medium shadow-lg">
            ⚠ {errorEventos}
          </div>
        )}
      </div>

      {/* ── EVENT GRID ── */}
      <div className="max-w-6xl mx-auto">
        {isLoadingEventos ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Cargando eventos disponibles..." />
          </div>
        ) : eventos.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/20 border border-white/5 rounded-2xl flex flex-col items-center justify-center">
            <p className="text-gray-400 text-lg">No hay eventos publicados en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.map((ev) => (
              <EventoPublicoCard
                key={ev.idEvento}
                evento={ev}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortalPage;
