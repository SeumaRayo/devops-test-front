import { useState, useCallback } from 'react';
import { eventoService } from '../services/evento.service';
import { EventoResponse, EventoFilterRequest, PageResponse, ComentarioRequest } from '../types/evento.types';

interface UseEventosState {
  data: PageResponse<EventoResponse> | null;
  isLoading: boolean;
  error: string | null;
}

export const useEventos = () => {
  const [state, setState] = useState<UseEventosState>({
    data: null,
    isLoading: false,
    error: null,
  });

  const [filters, setFilters] = useState<EventoFilterRequest>({ page: 0, size: 10 });

  const fetch = useCallback(async (newFilters?: EventoFilterRequest) => {
    const activeFilters = newFilters ?? filters;
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await eventoService.getAll(activeFilters);
      setState({ data: result, isLoading: false, error: null });
    } catch {
      setState(prev => ({ ...prev, isLoading: false, error: 'Error al cargar eventos.' }));
    }
  }, [filters]);

  const changePage = useCallback((page: number) => {
    const updated = { ...filters, page };
    setFilters(updated);
    fetch(updated);
  }, [filters, fetch]);

  const applyFilters = useCallback((newFilters: Partial<EventoFilterRequest>) => {
    const updated = { ...filters, ...newFilters, page: 0 };
    setFilters(updated);
    fetch(updated);
  }, [filters, fetch]);
  
  // Transition actions
  const actionTransition = useCallback(
    async (
      id: number,
      action: 'publicar' | 'cerrar' | 'activar' | 'cancelar' | 'desactivar',
      payload?: ComentarioRequest
    ) => {
      try {
        if (action === 'cancelar' || action === 'desactivar') {
          await eventoService[action](id, payload!);
        } else {
          await eventoService[action as 'publicar' | 'cerrar' | 'activar'](id);
        }
        fetch(filters);
      } catch {
        setState(prev => ({ ...prev, error: `Error al ${action} el evento.` }));
      }
    },
    [filters, fetch]
  );

  return {
    eventos: state.data?.content ?? [],
    pagination: state.data
      ? {
          page: (state.data.number ?? 0) + 1,
          totalPages: state.data.totalPages,
          onPageChange: changePage,
        }
      : undefined,
    isLoading: state.isLoading,
    error: state.error,
    filters,
    fetch,
    applyFilters,
    actionTransition,
  };
};
