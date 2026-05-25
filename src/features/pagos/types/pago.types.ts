export type TipoPago = 'COBRO' | 'REEMBOLSO';

export type EstadoPago = 
  | 'EXITOSO'
  | 'FALLIDO'
  | 'PENDIENTE';

export interface PagoResponse {
  idPago: number;
  idTicket: number;
  usuarioId: number;
  eventoId: number;
  monto: number;
  moneda: string;
  tipoPago: TipoPago;
  estadoPago: EstadoPago;
  stripeChargeId: string | null;
  stripeRefundId: string | null;
  creadoEn: string;
}
