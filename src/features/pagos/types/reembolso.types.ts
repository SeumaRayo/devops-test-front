export type EstadoReembolso = 
  | 'SOLICITADA'
  | 'EN_REVISION'
  | 'APROBADA'
  | 'RECHAZADA'
  | 'PROCESADA'
  | 'CANCELADA';

export interface ReembolsoResponse {
  id: number;
  ticketId: number;
  usuarioId: number;
  eventoId: number;
  estado: EstadoReembolso;
  motivoSolicitud: string;
  montoAprobado: number | null;
  comentarioOrganizador: string | null;
  fechaSolicitud: string;
  fechaActualizacion: string;
}

export interface SolicitarReembolsoRequest {
  motivoSolicitud: string;
}

export interface AprobarReembolsoRequest {
  montoAprobado: number;
  comentario?: string;
}

export interface RechazarReembolsoRequest {
  comentario: string;
}
