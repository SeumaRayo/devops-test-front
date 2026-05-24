import React, { useEffect, useState } from 'react';
import { eventoService } from '../services/evento.service';
import { usuarioService } from '../../usuarios/services/usuario.service';
import { StaffResponseDTO } from '../types/evento.types';
import { UsuarioOrganizadorResponse } from '../../usuarios/types/usuario.types';
import { Loader2, UserPlus, Check, X, Search } from 'lucide-react';

interface EventoStaffTabProps {
  idEvento: number;
}

export const EventoStaffTab: React.FC<EventoStaffTabProps> = ({ idEvento }) => {
  const [staff, setStaff] = useState<StaffResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [idUsuarioInput, setIdUsuarioInput] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState<'nombres' | 'username' | 'correo'>('nombres');
  const [searchResults, setSearchResults] = useState<UsuarioOrganizadorResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const data = await eventoService.getStaff(idEvento);
      setStaff(data);
    } catch (err: any) {
      setError('Error al cargar la lista de staff.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [idEvento]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idUsuarioInput.trim()) return;
    setIsAssigning(true);
    setError(null);
    try {
      await eventoService.assignStaff(idEvento, { idUsuario: Number(idUsuarioInput) });
      setIdUsuarioInput('');
      await fetchStaff();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al asignar staff.');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setHasSearched(true);
    try {
      const filters: Record<string, string | number> = { size: 5 };
      filters[searchField] = searchQuery;
      const data = await usuarioService.buscarUsuariosOrganizador(filters);
      setSearchResults(data.content);
    } catch (err) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const assignUserFromSearch = async (idUsuario: number) => {
    setIsAssigning(true);
    setError(null);
    try {
      await eventoService.assignStaff(idEvento, { idUsuario });
      await fetchStaff();
      // Opcional: limpiar búsqueda después de asignar exitosamente
      // setSearchQuery('');
      // setSearchResults([]);
      // setHasSearched(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al asignar staff.');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleToggleEstado = async (idUsuario: number, estadoActual: string) => {
    try {
      if (estadoActual === 'ACTIVO') {
        await eventoService.desactivarStaff(idEvento, idUsuario);
      } else {
        await eventoService.activarStaff(idEvento, idUsuario);
      }
      await fetchStaff();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cambiar estado.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10 text-gray-400">
        <Loader2 className="animate-spin mr-2" size={20} /> Cargando staff...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Assign Form & Search */}
      <div className="bg-gray-900/40 p-4 rounded-xl border border-white/5 space-y-4">
        <h3 className="text-sm font-semibold text-white">Buscar y Asignar Staff</h3>
        
        <form onSubmit={handleSearch} className="flex gap-3">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value as 'nombres' | 'username' | 'correo')}
            className="bg-gray-950 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-gray-300 outline-none focus:border-indigo-500 shrink-0"
          >
            <option value="nombres">Nombre</option>
            <option value="username">Username</option>
            <option value="correo">Correo</option>
          </select>
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder={
                searchField === 'nombres'
                  ? 'Buscar por nombre o apellido...'
                  : searchField === 'username'
                  ? 'Buscar por username...'
                  : 'Buscar por correo...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-950 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Buscar
          </button>
        </form>

        {/* Search Results */}
        {hasSearched && (
          <div className="bg-gray-950/50 rounded-lg border border-white/5 p-2 max-h-60 overflow-y-auto">
            {isSearching ? (
              <p className="text-gray-500 text-xs text-center py-2">Buscando...</p>
            ) : searchResults.length === 0 ? (
              <p className="text-gray-500 text-xs text-center py-2">No se encontraron usuarios.</p>
            ) : (
              <div className="space-y-1">
                {searchResults.map(user => {
                  const isAlreadyStaff = staff.some(s => s.idUsuario === user.idUsuario);
                  return (
                    <div key={user.idUsuario} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md group">
                      <div>
                        <p className="text-sm text-gray-300 font-medium">{user.nombres} {user.apellidos}</p>
                         <p className="text-xs text-gray-500">Doc: {user.documento} • {user.correo}</p>
                      </div>
                      <button
                        onClick={() => assignUserFromSearch(user.idUsuario)}
                        disabled={isAssigning || isAlreadyStaff}
                        className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1 ${
                          isAlreadyStaff 
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                            : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30'
                        }`}
                      >
                        {isAssigning && !isAlreadyStaff ? <Loader2 size={12} className="animate-spin" /> : <UserPlus size={12} />}
                        {isAlreadyStaff ? 'Asignado' : 'Asignar'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Manual ID Assignment (Fallback) */}
        <div className="pt-2 border-t border-white/5">
          <form onSubmit={handleAssign} className="flex gap-3">
            <input
              type="number"
              min="1"
              placeholder="Asignar directamente por ID (opcional)"
              value={idUsuarioInput}
              onChange={(e) => setIdUsuarioInput(e.target.value)}
              className="flex-1 bg-gray-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isAssigning || !idUsuarioInput.trim()}
              className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              Asignar por ID
            </button>
          </form>
        </div>
        
        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
      </div>

      {/* Staff List */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Staff Actual</h3>
        {staff.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center bg-gray-900/20 rounded-xl border border-white/5">
            No hay personal asignado a este evento.
          </p>
        ) : (
          <div className="space-y-2">
            {staff.map((s) => (
              <div key={s.idEventoStaff} className="flex items-center justify-between p-3 bg-gray-900/40 rounded-xl border border-white/5">
                <div>
                  <p className="text-sm font-medium text-white">{s.nombreCompleto}</p>
                  <p className="text-xs text-gray-500">ID Usuario: {s.idUsuario} • Asignado: {new Date(s.asignadoEn).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                    s.estado === 'ACTIVO' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {s.estado}
                  </span>
                  <button
                    onClick={() => handleToggleEstado(s.idUsuario, s.estado)}
                    className={`p-1.5 rounded-md transition-colors ${
                      s.estado === 'ACTIVO' 
                        ? 'text-red-400 hover:bg-red-500/10' 
                        : 'text-green-400 hover:bg-green-500/10'
                    }`}
                    title={s.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                  >
                    {s.estado === 'ACTIVO' ? <X size={16} /> : <Check size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
