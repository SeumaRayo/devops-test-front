import { useMutation } from '@tanstack/react-query';
import { ticketService, InscripcionResponse } from '../services/ticket.service';

export const useInscripcion = () => {
  return useMutation<InscripcionResponse, Error, number>({
    mutationFn: (eventoId: number) => ticketService.inscribirse(eventoId),
  });
};
