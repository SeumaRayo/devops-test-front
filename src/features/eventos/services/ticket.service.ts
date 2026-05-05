import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/apiEndpoints';

import { InscripcionResponse } from '../types/ticket.types';

export const ticketService = {
  inscribirse: async (eventoId: number): Promise<InscripcionResponse> => {
    const { data } = await axiosInstance.post<InscripcionResponse>(
      API_ENDPOINTS.TICKETS.INSCRIBIR(eventoId)
    );
    return data;
  },
};
