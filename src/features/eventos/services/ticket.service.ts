import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/apiEndpoints';

export interface InscripcionResponse {
  mensaje: string;
  ticketId: number;
  estadoTicket: string;
  clientSecret?: string;
}

export const ticketService = {
  inscribirse: async (eventoId: number): Promise<InscripcionResponse> => {
    const { data } = await axiosInstance.post<InscripcionResponse>(
      API_ENDPOINTS.TICKETS.INSCRIBIR(eventoId)
    );
    return data;
  },
};
