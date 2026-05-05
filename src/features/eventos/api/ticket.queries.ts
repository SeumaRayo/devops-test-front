import { useMutation } from '@tanstack/react-query';
import { ticketService } from '../services/ticket.service';
import { InscripcionResponse } from '../types/ticket.types';

export const useInscribirEvento = () => {
  return useMutation<InscripcionResponse, Error, number>({
    mutationFn: (eventoId: number) => ticketService.inscribirse(eventoId),
  });
};
