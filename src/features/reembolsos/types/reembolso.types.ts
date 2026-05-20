export type EstadoSolicitudReembolso =
  | 'SOLICITADA'
  | 'EN_REVISION'
  | 'APROBADA'
  | 'RECHAZADA'
  | 'CANCELADA'
  | 'REEMBOLSADA'
  | 'PROCESADA'
  | 'FALLIDA';

export type MedioReembolso =
  | 'CUENTA_BANCARIA'
  | 'NEQUI'
  | 'DAVIPLATA'
  | 'OTRO';

export type TipoCuentaReembolso =
  | 'AHORROS'
  | 'CORRIENTE';

export interface DatosReembolsoResponse {
  medioReembolso: MedioReembolso;
  titularCuenta: string;
  documentoTitular: string;
  entidadFinanciera: string | null;
  tipoCuenta: TipoCuentaReembolso | null;
  numeroCuentaEnmascarado: string | null;
  correoContacto: string;
  telefonoContacto: string;
  observaciones: string | null;
}

export interface SolicitudReembolsoResponse {
  idSolicitud: number;
  idTicket: number;
  idEvento: number;
  idUsuarioSolicitante: number;
  estado: EstadoSolicitudReembolso;
  motivo: string;
  respuestaOrganizador: string | null;
  montoSolicitado: number;
  montoAprobado: number | null;
  fechaSolicitud: string;
  fechaRevision: string | null;
  fechaProcesamiento: string | null;
  datosReembolso: DatosReembolsoResponse | null;
  version?: number;
}

export interface CrearSolicitudReembolsoFormValues {
  motivoSolicitud: string;
  medioReembolso: MedioReembolso;
  titularCuenta: string;
  documentoTitular: string;
  entidadFinanciera?: string;
  tipoCuenta?: TipoCuentaReembolso;
  numeroCuenta?: string;
  correoContacto: string;
  telefonoContacto: string;
  observaciones?: string;
  certificadoCuenta?: FileList;
  documentoAdicional?: FileList;
}

export interface AprobarReembolsoRequest {
  comentario?: string;
}

export interface RechazarReembolsoRequest {
  comentario: string;
}
