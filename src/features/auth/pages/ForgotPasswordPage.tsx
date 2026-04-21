import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '../validations/passwordReset.schema';
import { useRequestPasswordReset } from '../api/passwordReset.queries';
import { Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft, MailCheck } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { mutate, isPending, isSuccess, error } = useRequestPasswordReset();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      correoAcceso: '',
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    mutate(data.correoAcceso);
  };

  const backendError = error
    ? isAxiosError(error)
      ? error.response?.data?.message || 'Error al solicitar la recuperación'
      : 'Error inesperado al procesar la solicitud'
    : null;

  return (
    <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-gray-900/30 p-8 backdrop-blur-xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white">Recuperar Contraseña</h2>
        <p className="mt-2 text-sm text-gray-400">
          Ingresa tu correo y te enviaremos instrucciones.
        </p>
      </div>

      {isSuccess ? (
        <div className="animate-in fade-in rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center text-emerald-400">
          <MailCheck className="mx-auto mb-3 h-10 w-10 opacity-80" />
          <h3 className="mb-2 text-lg font-medium text-emerald-300">¡Revisa tu bandeja!</h3>
          <p className="text-sm">Si el correo está registrado, recibirás un enlace de recuperación.</p>
          <div className="mt-6">
            <Link to="/login" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Volver a iniciar sesión
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {backendError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              <strong>Atención:</strong> {backendError}
            </div>
          )}

          <div>
            <label htmlFor="correoAcceso" className="block text-sm font-medium text-gray-300 mb-1">
              Correo Electrónico
            </label>
            <Input
              id="correoAcceso"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              {...register('correoAcceso')}
              className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus-visible:ring-indigo-500"
              aria-label="Correo electrónico para recuperar contraseña"
            />
            {errors.correoAcceso && (
              <p className="mt-1 text-xs text-red-400">{errors.correoAcceso.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Recuperar Contraseña'
            )}
          </Button>

          <div className="text-center mt-4">
            <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a iniciar sesión
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};
