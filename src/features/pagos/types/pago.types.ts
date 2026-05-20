export type TipoTransaccion = 'COBRO' | 'REEMBOLSO';

export type EstadoPago = 
  | 'EXITOSO'
  | 'FALLIDO'
  | 'PENDIENTE';

export interface PagoResponse {
  id: number;
  ticketId: number;
  usuarioId: number;
  eventoId: number;
  monto: number;
  moneda: string;
  tipoTransaccion: TipoTransaccion;
  estado: EstadoPago;
  stripePaymentIntentId: string | null;
  stripeRefundId: string | null;
  fechaTransaccion: string;
}
