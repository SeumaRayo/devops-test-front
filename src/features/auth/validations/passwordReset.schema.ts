import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  correoAcceso: z.string().min(1, 'El correo es obligatorio').email('Correo electrónico inválido'),
});

export const resetPasswordSchema = z.object({
  passwordNueva: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmarPassword: z.string().min(1, 'Debe confirmar su contraseña'),
}).refine((data) => data.passwordNueva === data.confirmarPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmarPassword'],
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
