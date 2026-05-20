import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/apiEndpoints';
import {
  ReembolsoResponse,
  SolicitarReembolsoRequest,
  AprobarReembolsoRequest,
  RechazarReembolsoRequest,
} from '../types/reembolso.types';

export const reembolsoService = {
  // --- USUARIO FINAL ---

  solicitarReembolso: async (ticketId: number, payload: SolicitarReembolsoRequest): Promise<ReembolsoResponse> => {
    const { data } = await axiosInstance.post<ReembolsoResponse>(
      API_ENDPOINTS.TICKETS.SOLICITAR_REEMBOLSO(ticketId),
      payload
    );
    return data;
  },

  getMisSolicitudes: async (): Promise<ReembolsoResponse[]> => {
    const { data } = await axiosInstance.get<ReembolsoResponse[]>(
      API_ENDPOINTS.REEMBOLSOS.MIS_SOLICITUDES
    );
    return data;
  },

  getReembolsoById: async (id: number): Promise<ReembolsoResponse> => {
    const { data } = await axiosInstance.get<ReembolsoResponse>(
      API_ENDPOINTS.REEMBOLSOS.BY_ID(id)
    );
    return data;
  },

  cancelarReembolso: async (id: number): Promise<ReembolsoResponse> => {
    const { data } = await axiosInstance.patch<ReembolsoResponse>(
      API_ENDPOINTS.REEMBOLSOS.CANCELAR(id),
      {}
    );
    return data;
  },

  // --- ORGANIZADOR / ADMIN ---

  getReembolsosPorEvento: async (eventoId: number): Promise<ReembolsoResponse[]> => {
    const { data } = await axiosInstance.get<ReembolsoResponse[]>(
      API_ENDPOINTS.EVENTOS.REEMBOLSOS.BASE(eventoId)
    );
    return data;
  },

  getReembolsoEventoById: async (eventoId: number, solicitudId: number): Promise<ReembolsoResponse> => {
    const { data } = await axiosInstance.get<ReembolsoResponse>(
      API_ENDPOINTS.EVENTOS.REEMBOLSOS.BY_ID(eventoId, solicitudId)
    );
    return data;
  },

  revisarReembolso: async (eventoId: number, solicitudId: number): Promise<ReembolsoResponse> => {
    const { data } = await axiosInstance.patch<ReembolsoResponse>(
      API_ENDPOINTS.EVENTOS.REEMBOLSOS.REVISAR(eventoId, solicitudId),
      {}
    );
    return data;
  },

  aprobarReembolso: async (
    eventoId: number,
    solicitudId: number,
    payload: AprobarReembolsoRequest
  ): Promise<ReembolsoResponse> => {
    const { data } = await axiosInstance.patch<ReembolsoResponse>(
      API_ENDPOINTS.EVENTOS.REEMBOLSOS.APROBAR(eventoId, solicitudId),
      payload
    );
    return data;
  },

  rechazarReembolso: async (
    eventoId: number,
    solicitudId: number,
    payload: RechazarReembolsoRequest
  ): Promise<ReembolsoResponse> => {
    const { data } = await axiosInstance.patch<ReembolsoResponse>(
      API_ENDPOINTS.EVENTOS.REEMBOLSOS.RECHAZAR(eventoId, solicitudId),
      payload
    );
    return data;
  },

};
