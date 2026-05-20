import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];

const optionalFileSchema = z
  .any()
  .optional()
  .refine((files) => {
    if (!files || files.length === 0) return true;
    return files[0]?.size <= MAX_FILE_SIZE;
  }, 'El archivo no puede superar los 5 MB')
  .refine((files) => {
    if (!files || files.length === 0) return true;
    return ACCEPTED_FILE_TYPES.includes(files[0]?.type);
  }, 'Solo se permiten archivos PDF, JPG o PNG');

export const crearSolicitudReembolsoSchema = z
  .object({
    motivoSolicitud: z
      .string()
      .min(10, 'El motivo debe tener al menos 10 caracteres')
      .max(500, 'El motivo no puede superar los 500 caracteres'),

    medioReembolso: z.enum(['CUENTA_BANCARIA', 'NEQUI', 'DAVIPLATA', 'OTRO'], {
      message: 'Selecciona un medio de reembolso',
    }),

    titularCuenta: z
      .string()
      .min(1, 'El titular de la cuenta es obligatorio')
      .max(150, 'El titular no puede superar los 150 caracteres'),

    documentoTitular: z
      .string()
      .min(1, 'El documento del titular es obligatorio')
      .max(20, 'El documento no puede superar los 20 caracteres'),

    entidadFinanciera: z.string().optional(),
    tipoCuenta: z.enum(['AHORROS', 'CORRIENTE']).optional(),
    numeroCuenta: z.string().optional(),

    correoContacto: z
      .string()
      .min(1, 'El correo de contacto es obligatorio')
      .email('Ingresa un correo valido'),

    telefonoContacto: z
      .string()
      .min(1, 'El telefono de contacto es obligatorio')
      .max(30, 'El telefono no puede superar los 30 caracteres'),

    observaciones: z
      .string()
      .max(1000, 'Las observaciones no pueden superar los 1000 caracteres')
      .optional(),

    certificadoCuenta: optionalFileSchema,
    documentoAdicional: optionalFileSchema,
  })
  .superRefine((values, ctx) => {
    if (values.medioReembolso !== 'CUENTA_BANCARIA') {
      return;
    }

    if (!values.entidadFinanciera || values.entidadFinanciera.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['entidadFinanciera'],
        message: 'La entidad financiera es obligatoria para cuentas bancarias',
      });
    }

    if (!values.tipoCuenta) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['tipoCuenta'],
        message: 'El tipo de cuenta es obligatorio para cuentas bancarias',
      });
    }

    if (!values.numeroCuenta || values.numeroCuenta.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['numeroCuenta'],
        message: 'El numero de cuenta es obligatorio para cuentas bancarias',
      });
    }

    if (!values.certificadoCuenta || values.certificadoCuenta.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['certificadoCuenta'],
        message: 'El certificado de cuenta es obligatorio para cuentas bancarias',
      });
    }
  });

export type CrearSolicitudReembolsoFormData = z.infer<typeof crearSolicitudReembolsoSchema>;

export const aprobarReembolsoSchema = z.object({
  comentario: z.string().max(500, 'El comentario no puede superar los 500 caracteres').optional(),
});

export type AprobarReembolsoFormData = z.infer<typeof aprobarReembolsoSchema>;

export const rechazarReembolsoSchema = z.object({
  comentario: z
    .string()
    .min(1, 'El comentario es obligatorio')
    .max(500, 'El comentario no puede superar los 500 caracteres'),
});

export type RechazarReembolsoFormData = z.infer<typeof rechazarReembolsoSchema>;
