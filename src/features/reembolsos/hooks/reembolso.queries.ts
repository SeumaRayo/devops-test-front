import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reembolsoService } from '../services/reembolso.service';
import {
  CrearSolicitudReembolsoFormValues,
  AprobarReembolsoRequest,
  RechazarReembolsoRequest,
} from '../types/reembolso.types';
import { reembolsosKeys } from '../api/reembolsos.keys';

// ============================================================
// QUERIES
// ============================================================

export const useMisSolicitudesReembolso = () => {
  return useQuery({
    queryKey: reembolsosKeys.misSolicitudes(),
    queryFn: reembolsoService.getMisSolicitudesReembolso,
  });
};

export const useSolicitudReembolso = (id: number) => {
  return useQuery({
    queryKey: reembolsosKeys.detalle(id),
    queryFn: () => reembolsoService.getSolicitudReembolso(id),
    enabled: !!id,
  });
};

export const useReembolsosPorEvento = (eventoId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: reembolsosKeys.evento(eventoId),
    queryFn: () => reembolsoService.getReembolsosPorEvento(eventoId),
    enabled: !!eventoId && enabled,
  });
};

export const useReembolsoEventoDetalle = (eventoId: number, solicitudId: number) => {
  return useQuery({
    queryKey: reembolsosKeys.eventoDetalle(eventoId, solicitudId),
    queryFn: () => reembolsoService.getReembolsoEventoDetalle(eventoId, solicitudId),
    enabled: !!eventoId && !!solicitudId,
  });
};

// ============================================================
// MUTATIONS
// ============================================================

export const useCrearSolicitudReembolso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ticketId,
      values,
    }: {
      ticketId: number;
      values: CrearSolicitudReembolsoFormValues;
    }) => reembolsoService.crearSolicitudReembolso(ticketId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reembolsosKeys.misSolicitudes() });
      queryClient.invalidateQueries({ queryKey: ['mis-tickets'] });
    },
  });
};

export const useCancelarSolicitudReembolso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reembolsoService.cancelarSolicitudReembolso(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: reembolsosKeys.misSolicitudes() });
      queryClient.invalidateQueries({ queryKey: reembolsosKeys.detalle(id) });
      queryClient.invalidateQueries({ queryKey: ['mis-tickets'] });
    },
  });
};

export const useRevisarSolicitudReembolso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventoId,
      solicitudId,
    }: {
      eventoId: number;
      solicitudId: number;
    }) => reembolsoService.revisarSolicitudReembolso(eventoId, solicitudId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reembolsosKeys.evento(variables.eventoId) });
      queryClient.invalidateQueries({
        queryKey: reembolsosKeys.eventoDetalle(variables.eventoId, variables.solicitudId),
      });
    },
  });
};

export const useAprobarSolicitudReembolso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventoId,
      solicitudId,
      payload,
    }: {
      eventoId: number;
      solicitudId: number;
      payload: AprobarReembolsoRequest;
    }) => reembolsoService.aprobarSolicitudReembolso(eventoId, solicitudId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reembolsosKeys.evento(variables.eventoId) });
      queryClient.invalidateQueries({
        queryKey: reembolsosKeys.eventoDetalle(variables.eventoId, variables.solicitudId),
      });
    },
  });
};

export const useRechazarSolicitudReembolso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventoId,
      solicitudId,
      payload,
    }: {
      eventoId: number;
      solicitudId: number;
      payload: RechazarReembolsoRequest;
    }) => reembolsoService.rechazarSolicitudReembolso(eventoId, solicitudId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reembolsosKeys.evento(variables.eventoId) });
      queryClient.invalidateQueries({
        queryKey: reembolsosKeys.eventoDetalle(variables.eventoId, variables.solicitudId),
      });
    },
  });
};

export const useMarcarSolicitudComoReembolsada = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventoId,
      solicitudId,
    }: {
      eventoId: number;
      solicitudId: number;
    }) => reembolsoService.marcarSolicitudComoReembolsada(eventoId, solicitudId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reembolsosKeys.evento(variables.eventoId) });
      queryClient.invalidateQueries({
        queryKey: reembolsosKeys.eventoDetalle(variables.eventoId, variables.solicitudId),
      });
      queryClient.invalidateQueries({ queryKey: ['eventos', variables.eventoId] });
    },
  });
};
