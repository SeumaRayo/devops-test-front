export type EstadoTicket =
  | 'GRATIS'
  | 'PENDIENTE'
  | 'PAGADO'
  | 'CANCELADO'
  | 'REEMBOLSADO'
  | 'EXPIRADO';

export type EstadoInscripcion =
  | 'NO_INSCRITO'
  | 'INSCRITO'
  | 'CHECKOUT_PENDIENTE'
  | 'PAGO_EN_PROCESO'
  | 'REINTENTO_DISPONIBLE';

// Response from POST /tickets/evento/{eventoId}
export interface InscripcionResponse {
  idTicket: number;
  estadoTicket: EstadoTicket;
  codigoQr: string;
  clientSecret: string | null;
  expiraEn?: string | number | null;
  // Legacy compatibility
  ticketId?: number;
  mensaje?: string;
}

export interface CheckoutPendienteResponse {
  ticketId: number;
  clientSecret: string;
  expiraEn?: string | number | null;
}

export interface MiEstadoEventoResponse {
  eventoId: number;
  inscrito: boolean;
  puedeInscribirse: boolean;
  ticketId: number | null;
  estadoTicket: EstadoTicket | null;
  estadoInscripcion: EstadoInscripcion;
  expiraEn: string | number | null;
  checkinRealizado: boolean;
}

// Full ticket DTO returned by GET /tickets/mis-tickets and GET /tickets/{id}
export interface TicketResponseDTO {
  idTicket: number;
  idEvento: number;
  nombreEvento: string;
  idUsuario: number;
  estadoTicket: EstadoTicket;
  montoPagado: number;
  moneda: string | null;
  codigoQr: string;
  fechaCompra: string;
  creadoEn: string;
}
