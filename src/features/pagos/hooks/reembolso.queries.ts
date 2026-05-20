import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reembolsoService } from '../services/reembolso.service';
import { SolicitarReembolsoRequest, AprobarReembolsoRequest, RechazarReembolsoRequest } from '../types/reembolso.types';

// --- USUARIO FINAL ---

export const useMisSolicitudes = () => {
  return useQuery({
    queryKey: ['mis-solicitudes'],
    queryFn: reembolsoService.getMisSolicitudes,
  });
};

export const useSolicitarReembolso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, payload }: { ticketId: number; payload: SolicitarReembolsoRequest }) =>
      reembolsoService.solicitarReembolso(ticketId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mis-solicitudes'] });
      queryClient.invalidateQueries({ queryKey: ['mis-tickets'] });
    },
  });
};

export const useCancelarReembolso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reembolsoService.cancelarReembolso(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mis-solicitudes'] });
    },
  });
};

// --- ORGANIZADOR / ADMIN ---

export const useReembolsosPorEvento = (eventoId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['reembolsos', eventoId],
    queryFn: () => reembolsoService.getReembolsosPorEvento(eventoId),
    enabled,
  });
};

export const useRevisarReembolso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventoId, solicitudId }: { eventoId: number; solicitudId: number }) =>
      reembolsoService.revisarReembolso(eventoId, solicitudId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reembolsos', variables.eventoId] });
    },
  });
};

export const useAprobarReembolso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventoId, solicitudId, payload }: { eventoId: number; solicitudId: number; payload: AprobarReembolsoRequest }) =>
      reembolsoService.aprobarReembolso(eventoId, solicitudId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reembolsos', variables.eventoId] });
    },
  });
};

export const useRechazarReembolso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventoId, solicitudId, payload }: { eventoId: number; solicitudId: number; payload: RechazarReembolsoRequest }) =>
      reembolsoService.rechazarReembolso(eventoId, solicitudId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reembolsos', variables.eventoId] });
    },
  });
};

