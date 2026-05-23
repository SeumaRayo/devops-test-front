import { z } from 'zod';

export type EstadoSolicitudReembolso =
  | 'SOLICITADA'
  | 'EN_REVISION'
  | 'APROBADA'
  | 'RECHAZADA'
  | 'CANCELADA'
  | 'REEMBOLSADA'
  | 'PROCESADA'
  | 'FALLIDA';

export type MedioReembolso = 'CUENTA_BANCARIA' | 'NEQUI' | 'DAVIPLATA' | 'OTRO';

export type TipoCuentaReembolso = 'AHORROS' | 'CORRIENTE';

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
}

export interface AprobarReembolsoRequest {
  comentario?: string;
}

export interface RechazarReembolsoRequest {
  comentario: string;
}

export const solicitarReembolsoSchema = z.object({
  motivoSolicitud: z.string().min(10, 'El motivo debe tener al menos 10 caracteres'),
  medioReembolso: z.enum(['CUENTA_BANCARIA', 'NEQUI', 'DAVIPLATA', 'OTRO'], {
    message: 'Selecciona un medio de reembolso',
  }),
  titularCuenta: z.string().min(1, 'El titular es requerido'),
  documentoTitular: z.string().min(1, 'El documento es requerido'),
  entidadFinanciera: z.string().optional(),
  tipoCuenta: z.enum(['AHORROS', 'CORRIENTE']).optional(),
  numeroCuenta: z.string().optional(),
  correoContacto: z.string().email('Correo inválido'),
  telefonoContacto: z.string().min(1, 'El teléfono es requerido'),
  observaciones: z.string().optional(),
});

export type SolicitarReembolsoFormValues = z.infer<typeof solicitarReembolsoSchema>;
