import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/apiEndpoints';
import {
  EventoResponse,
  CreateEventoRequest,
  UpdateEventoRequest,
  HistorialEventoResponse,
  ComentarioRequest,
  EventoFilterRequest,
  EventoDisponiblesFilterRequest,
  MisEventosFilterRequest,
  PageResponse,
} from '../types/evento.types';
import { TicketResponseDTO } from '../types/ticket.types';

export const eventoService = {
  // GET /api/v1/eventos  — ADMIN ONLY
  getAll: async (filters: EventoFilterRequest = {}): Promise<PageResponse<EventoResponse>> => {
    const params = {
      page: filters.page ?? 0,
      size: filters.size ?? 10,
      ...(filters.estadoEvento && { estadoEvento: filters.estadoEvento }),
      ...(filters.estado && { estado: filters.estado }),
      ...(filters.nombre && { nombre: filters.nombre }),
      ...(filters.lugar && { lugar: filters.lugar }),
      ...(filters.usuarioCreador && { usuarioCreador: filters.usuarioCreador }),
      ...(filters.fechaInicio && { fechaInicio: filters.fechaInicio }),
      ...(filters.fechaFin && { fechaFin: filters.fechaFin }),
    };
    const { data } = await axiosInstance.get<PageResponse<EventoResponse>>(API_ENDPOINTS.EVENTOS.BASE, { params });
    return data;
  },

  // GET /api/v1/eventos/disponibles  — All authenticated roles (USER, ORGANIZER, ADMIN)
  getDisponibles: async (filters: EventoDisponiblesFilterRequest = {}): Promise<PageResponse<EventoResponse>> => {
    const params = {
      page: filters.page ?? 0,
      size: filters.size ?? 20,
      ...(filters.nombre && { nombre: filters.nombre }),
      ...(filters.lugar && { lugar: filters.lugar }),
      ...(filters.fechaInicio && { fechaInicio: filters.fechaInicio }),
      ...(filters.fechaFin && { fechaFin: filters.fechaFin }),
      ...(filters.esDePago !== undefined && { esDePago: filters.esDePago }),
      ...(filters.conCupos !== undefined && { conCupos: filters.conCupos }),
    };
    const { data } = await axiosInstance.get<PageResponse<EventoResponse>>(
      API_ENDPOINTS.EVENTOS.DISPONIBLES,
      { params }
    );
    return data;
  },

  // GET /api/v1/eventos/mis-eventos  — ORGANIZER and ADMIN only
  getMisEventos: async (filters: MisEventosFilterRequest = {}): Promise<PageResponse<EventoResponse>> => {
    const params = {
      page: filters.page ?? 0,
      size: filters.size ?? 20,
      ...(filters.estadoEvento && { estadoEvento: filters.estadoEvento }),
      ...(filters.estado && { estado: filters.estado }),
      ...(filters.nombre && { nombre: filters.nombre }),
      ...(filters.lugar && { lugar: filters.lugar }),
      ...(filters.fechaInicio && { fechaInicio: filters.fechaInicio }),
      ...(filters.fechaFin && { fechaFin: filters.fechaFin }),
    };
    const { data } = await axiosInstance.get<PageResponse<EventoResponse>>(
      API_ENDPOINTS.EVENTOS.MIS_EVENTOS,
      { params }
    );
    return data;
  },

  // GET /api/v1/eventos/{id}  — ADMIN or ORGANIZER (owner)
  getById: async (id: number): Promise<EventoResponse> => {
    const { data } = await axiosInstance.get<EventoResponse>(API_ENDPOINTS.EVENTOS.BY_ID(id));
    return data;
  },

  // POST /api/v1/eventos  — ORGANIZER and ADMIN only
  create: async (payload: CreateEventoRequest): Promise<EventoResponse> => {
    const { data } = await axiosInstance.post<EventoResponse>(API_ENDPOINTS.EVENTOS.BASE, payload);
    return data;
  },

  // PUT /api/v1/eventos/{id}  — ORGANIZER (owner) and ADMIN
  update: async (id: number, payload: UpdateEventoRequest): Promise<EventoResponse> => {
    const { data } = await axiosInstance.put<EventoResponse>(API_ENDPOINTS.EVENTOS.BY_ID(id), payload);
    return data;
  },

  // GET /api/v1/usuarios/{idUsuario}/eventos  — ADMIN only
  getByUser: async (idUsuario: number, page = 0, size = 10): Promise<PageResponse<EventoResponse>> => {
    const { data } = await axiosInstance.get<PageResponse<EventoResponse>>(
      API_ENDPOINTS.EVENTOS.BY_USER(idUsuario),
      { params: { page, size } }
    );
    return data;
  },

  // GET /api/v1/eventos/{id}/tickets  — ADMIN or ORGANIZER (owner)
  getTicketsEvento: async (id: number): Promise<TicketResponseDTO[]> => {
    const { data } = await axiosInstance.get<TicketResponseDTO[]>(API_ENDPOINTS.EVENTOS.TICKETS_DEL_EVENTO(id));
    return data;
  },

  // GET /api/v1/eventos/{id}/historial  — ADMIN or ORGANIZER (owner)
  getHistorial: async (id: number): Promise<HistorialEventoResponse[]> => {
    const { data } = await axiosInstance.get<HistorialEventoResponse[]>(API_ENDPOINTS.EVENTOS.HISTORIAL(id));
    return data;
  },

  // PATCH /api/v1/eventos/{id}/publicar
  publicar: async (id: number): Promise<EventoResponse> => {
    const { data } = await axiosInstance.patch<EventoResponse>(API_ENDPOINTS.EVENTOS.PUBLICAR(id));
    return data;
  },

  // PATCH /api/v1/eventos/{id}/cerrar
  cerrar: async (id: number): Promise<EventoResponse> => {
    const { data } = await axiosInstance.patch<EventoResponse>(API_ENDPOINTS.EVENTOS.CERRAR(id));
    return data;
  },

  // PATCH /api/v1/eventos/{id}/cancelar
  cancelar: async (id: number, payload: ComentarioRequest): Promise<EventoResponse> => {
    const { data } = await axiosInstance.patch<EventoResponse>(API_ENDPOINTS.EVENTOS.CANCELAR(id), payload);
    return data;
  },

  // PATCH /api/v1/eventos/{id}/activar
  activar: async (id: number): Promise<EventoResponse> => {
    const { data } = await axiosInstance.patch<EventoResponse>(API_ENDPOINTS.EVENTOS.ACTIVAR(id));
    return data;
  },

  // PATCH /api/v1/eventos/{id}/desactivar
  desactivar: async (id: number, payload: ComentarioRequest): Promise<EventoResponse> => {
    const { data } = await axiosInstance.patch<EventoResponse>(API_ENDPOINTS.EVENTOS.DESACTIVAR(id), payload);
    return data;
  },
};
