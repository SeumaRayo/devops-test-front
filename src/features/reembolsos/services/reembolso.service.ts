import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/apiEndpoints';
import {
  SolicitudReembolsoResponse,
  CrearSolicitudReembolsoFormValues,
  AprobarReembolsoRequest,
  RechazarReembolsoRequest,
} from '../types/reembolso.types';

export const reembolsoService = {
  // --- USUARIO COMPRADOR ---

  crearSolicitudReembolso: async (
    ticketId: number,
    values: CrearSolicitudReembolsoFormValues
  ): Promise<SolicitudReembolsoResponse> => {
    const formData = new FormData();

    formData.append('motivoSolicitud', values.motivoSolicitud);
    formData.append('medioReembolso', values.medioReembolso);
    formData.append('titularCuenta', values.titularCuenta);
    formData.append('documentoTitular', values.documentoTitular);
    formData.append('correoContacto', values.correoContacto);
    formData.append('telefonoContacto', values.telefonoContacto);

    if (values.entidadFinanciera) {
      formData.append('entidadFinanciera', values.entidadFinanciera);
    }

    if (values.tipoCuenta) {
      formData.append('tipoCuenta', values.tipoCuenta);
    }

    if (values.numeroCuenta) {
      formData.append('numeroCuenta', values.numeroCuenta);
    }

    if (values.observaciones) {
      formData.append('observaciones', values.observaciones);
    }

    const certificado = values.certificadoCuenta?.[0];
    if (certificado) {
      formData.append('certificadoCuenta', certificado);
    }

    const documentoAdicional = values.documentoAdicional?.[0];
    if (documentoAdicional) {
      formData.append('documentoAdicional', documentoAdicional);
    }

    const { data } = await axiosInstance.post<SolicitudReembolsoResponse>(
      API_ENDPOINTS.TICKETS.SOLICITAR_REEMBOLSO(ticketId),
      formData
    );

    return data;
  },

  getMisSolicitudesReembolso: async (): Promise<SolicitudReembolsoResponse[]> => {
    const { data } = await axiosInstance.get<SolicitudReembolsoResponse[]>(
      API_ENDPOINTS.REEMBOLSOS.MIS_SOLICITUDES
    );
    return data;
  },

  getSolicitudReembolso: async (id: number): Promise<SolicitudReembolsoResponse> => {
    const { data } = await axiosInstance.get<SolicitudReembolsoResponse>(
      API_ENDPOINTS.REEMBOLSOS.BY_ID(id)
    );
    return data;
  },

  cancelarSolicitudReembolso: async (id: number): Promise<void> => {
    await axiosInstance.patch(API_ENDPOINTS.REEMBOLSOS.CANCELAR(id));
  },

  // --- ORGANIZADOR / ADMIN ---

  getReembolsosPorEvento: async (eventoId: number): Promise<SolicitudReembolsoResponse[]> => {
    const { data } = await axiosInstance.get<SolicitudReembolsoResponse[]>(
      API_ENDPOINTS.EVENTOS.REEMBOLSOS.BASE(eventoId)
    );
    return data;
  },

  getReembolsoEventoDetalle: async (
    eventoId: number,
    solicitudId: number
  ): Promise<SolicitudReembolsoResponse> => {
    const { data } = await axiosInstance.get<SolicitudReembolsoResponse>(
      API_ENDPOINTS.EVENTOS.REEMBOLSOS.BY_ID(eventoId, solicitudId)
    );
    return data;
  },

  revisarSolicitudReembolso: async (
    eventoId: number,
    solicitudId: number
  ): Promise<SolicitudReembolsoResponse> => {
    const { data } = await axiosInstance.patch<SolicitudReembolsoResponse>(
      API_ENDPOINTS.EVENTOS.REEMBOLSOS.REVISAR(eventoId, solicitudId)
    );
    return data;
  },

  aprobarSolicitudReembolso: async (
    eventoId: number,
    solicitudId: number,
    payload: AprobarReembolsoRequest
  ): Promise<SolicitudReembolsoResponse> => {
    const { data } = await axiosInstance.patch<SolicitudReembolsoResponse>(
      API_ENDPOINTS.EVENTOS.REEMBOLSOS.APROBAR(eventoId, solicitudId),
      payload
    );
    return data;
  },

  rechazarSolicitudReembolso: async (
    eventoId: number,
    solicitudId: number,
    payload: RechazarReembolsoRequest
  ): Promise<SolicitudReembolsoResponse> => {
    const { data } = await axiosInstance.patch<SolicitudReembolsoResponse>(
      API_ENDPOINTS.EVENTOS.REEMBOLSOS.RECHAZAR(eventoId, solicitudId),
      payload
    );
    return data;
  },

  marcarSolicitudComoReembolsada: async (
    eventoId: number,
    solicitudId: number
  ): Promise<SolicitudReembolsoResponse> => {
    const { data } = await axiosInstance.patch<SolicitudReembolsoResponse>(
      API_ENDPOINTS.EVENTOS.REEMBOLSOS.MARCAR_REEMBOLSADO(eventoId, solicitudId)
    );
    return data;
  },
};
