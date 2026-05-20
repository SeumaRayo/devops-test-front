import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/apiEndpoints';
import { PagoResponse } from '../types/pago.types';

export const pagoService = {
  getMisPagos: async (): Promise<PagoResponse[]> => {
    const { data } = await axiosInstance.get<PagoResponse[]>(
      API_ENDPOINTS.PAGOS.MIS_PAGOS
    );
    return data;
  },

  getPagosPorEvento: async (eventoId: number): Promise<PagoResponse[]> => {
    const { data } = await axiosInstance.get<PagoResponse[]>(
      API_ENDPOINTS.EVENTOS.PAGOS.BASE(eventoId)
    );
    return data;
  },
};
