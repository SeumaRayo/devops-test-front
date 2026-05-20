import { useQuery } from '@tanstack/react-query';
import { pagoService } from '../services/pago.service';

export const useMisPagos = () => {
  return useQuery({
    queryKey: ['mis-pagos'],
    queryFn: pagoService.getMisPagos,
  });
};

export const usePagosPorEvento = (eventoId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['pagos', eventoId],
    queryFn: () => pagoService.getPagosPorEvento(eventoId),
    enabled,
  });
};
