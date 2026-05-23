import axiosInstance from '../../../lib/axios';
import {
  SolicitudReembolsoResponse,
  SolicitarReembolsoFormValues,
  AprobarReembolsoRequest,
  RechazarReembolsoRequest,
} from '../types/reembolso.types';

const ENDPOINTS = {
  MIS_SOLICITUDES: '/api/v1/reembolsos/mis-solicitudes',
  BY_ID: (id: number) => `/api/v1/reembolsos/${id}`,
  SOLICITAR: (ticketId: number) => `/api/v1/tickets/${ticketId}/solicitar-reembolso`,
  CANCELAR: (id: number) => `/api/v1/reembolsos/${id}/cancelar`,
  POR_EVENTO: (eventoId: number) => `/api/v1/eventos/${eventoId}/reembolsos`,
  DETALLE: (eventoId: number, solicitudId: number) => `/api/v1/eventos/${eventoId}/reembolsos/${solicitudId}`,
  REVISAR: (eventoId: number, solicitudId: number) => `/api/v1/eventos/${eventoId}/reembolsos/${solicitudId}/revisar`,
  APROBAR: (eventoId: number, solicitudId: number) => `/api/v1/eventos/${eventoId}/reembolsos/${solicitudId}/aprobar`,
  RECHAZAR: (eventoId: number, solicitudId: number) => `/api/v1/eventos/${eventoId}/reembolsos/${solicitudId}/rechazar`,
  MARCAR_REEMBOLSADO: (eventoId: number, solicitudId: number) => `/api/v1/eventos/${eventoId}/reembolsos/${solicitudId}/marcar-reembolsado`,
};

export const reembolsoService = {
  getMisSolicitudes: async (): Promise<SolicitudReembolsoResponse[]> => {
    const { data } = await axiosInstance.get<SolicitudReembolsoResponse[]>(ENDPOINTS.MIS_SOLICITUDES);
    return data;
  },

  getSolicitudById: async (id: number): Promise<SolicitudReembolsoResponse> => {
    const { data } = await axiosInstance.get<SolicitudReembolsoResponse>(ENDPOINTS.BY_ID(id));
    return data;
  },

  solicitarReembolso: async (ticketId: number, values: SolicitarReembolsoFormValues): Promise<SolicitudReembolsoResponse> => {
    const formData = new FormData();
    formData.append('motivoSolicitud', values.motivoSolicitud);
    formData.append('medioReembolso', values.medioReembolso);
    formData.append('titularCuenta', values.titularCuenta);
    formData.append('documentoTitular', values.documentoTitular);
    formData.append('correoContacto', values.correoContacto);
    formData.append('telefonoContacto', values.telefonoContacto);
    if (values.entidadFinanciera) formData.append('entidadFinanciera', values.entidadFinanciera);
    if (values.tipoCuenta) formData.append('tipoCuenta', values.tipoCuenta);
    if (values.numeroCuenta) formData.append('numeroCuenta', values.numeroCuenta);
    if (values.observaciones) formData.append('observaciones', values.observaciones);

    const { data } = await axiosInstance.post<SolicitudReembolsoResponse>(
      ENDPOINTS.SOLICITAR(ticketId),
      formData
    );
    return data;
  },

  cancelarSolicitud: async (id: number): Promise<void> => {
    await axiosInstance.patch(ENDPOINTS.CANCELAR(id));
  },

  getReembolsosPorEvento: async (eventoId: number): Promise<SolicitudReembolsoResponse[]> => {
    const { data } = await axiosInstance.get<SolicitudReembolsoResponse[]>(ENDPOINTS.POR_EVENTO(eventoId));
    return data;
  },

  revisarSolicitud: async (eventoId: number, solicitudId: number): Promise<SolicitudReembolsoResponse> => {
    const { data } = await axiosInstance.patch<SolicitudReembolsoResponse>(ENDPOINTS.REVISAR(eventoId, solicitudId));
    return data;
  },

  aprobarSolicitud: async (eventoId: number, solicitudId: number, payload: AprobarReembolsoRequest): Promise<SolicitudReembolsoResponse> => {
    const { data } = await axiosInstance.patch<SolicitudReembolsoResponse>(ENDPOINTS.APROBAR(eventoId, solicitudId), payload);
    return data;
  },

  rechazarSolicitud: async (eventoId: number, solicitudId: number, payload: RechazarReembolsoRequest): Promise<SolicitudReembolsoResponse> => {
    const { data } = await axiosInstance.patch<SolicitudReembolsoResponse>(ENDPOINTS.RECHAZAR(eventoId, solicitudId), payload);
    return data;
  },

  marcarComoReembolsada: async (eventoId: number, solicitudId: number): Promise<SolicitudReembolsoResponse> => {
    const { data } = await axiosInstance.patch<SolicitudReembolsoResponse>(ENDPOINTS.MARCAR_REEMBOLSADO(eventoId, solicitudId));
    return data;
  },
};
