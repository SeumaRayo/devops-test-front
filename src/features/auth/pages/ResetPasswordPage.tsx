import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormValues } from '../validations/passwordReset.schema';
import { useResetPassword } from '../api/passwordReset.queries';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft, KeyRound, XCircle } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const { mutate, isPending, isSuccess, error } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      passwordNueva: '',
      confirmarPassword: '',
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    if (token) {
      mutate({ token, passwordNueva: data.passwordNueva });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex flex-col justify-center items-center p-4">
        <div className="absolute top-0 w-full p-6 flex justify-between items-center">
          <div className="text-white font-bold text-xl tracking-wider">DevOps<span className="text-indigo-500">App</span></div>
        </div>
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-gray-900/50 p-8 backdrop-blur-xl shadow-2xl">
        <div className="text-center">
          <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500 opacity-80" />
          <h2 className="text-2xl font-bold tracking-tight text-white">Enlace Inválido</h2>
          <p className="mt-2 text-sm text-gray-400">
            El enlace de recuperación de contraseña está ausente, ha expirado o es inválido.
          </p>
          <div className="mt-6">
            <Link to="/forgot-password" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Solicitar un nuevo enlace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const backendError = error
    ? isAxiosError(error)
      ? error.response?.data?.message || 'Error al restablecer la contraseña'
      : 'Error inesperado al procesar la solicitud'
    : null;

  return (
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex flex-col justify-center items-center p-4">
      <div className="absolute top-0 w-full p-6 flex justify-between items-center">
        <div className="text-white font-bold text-xl tracking-wider">DevOps<span className="text-indigo-500">App</span></div>
      </div>
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-gray-900/50 p-8 backdrop-blur-xl shadow-2xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white">Nueva Contraseña</h2>
        <p className="mt-2 text-sm text-gray-400">
          Ingresa y confirma tu nueva contraseña.
        </p>
      </div>

      {isSuccess ? (
        <div className="animate-in fade-in rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center text-emerald-400">
          <KeyRound className="mx-auto mb-3 h-10 w-10 opacity-80" />
          <h3 className="mb-2 text-lg font-medium text-emerald-300">¡Contraseña actualizada!</h3>
          <p className="text-sm">Redirigiendo al inicio de sesión...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {backendError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              <strong>Atención:</strong> {backendError}
            </div>
          )}

          <div>
            <label htmlFor="passwordNueva" className="block text-sm font-medium text-gray-300 mb-1">
              Nueva Contraseña
            </label>
            <Input
              id="passwordNueva"
              type="password"
              placeholder="••••••••"
              {...register('passwordNueva')}
              className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus-visible:ring-indigo-500"
              aria-label="Nueva contraseña"
            />
            {errors.passwordNueva && (
              <p className="mt-1 text-xs text-red-400">{errors.passwordNueva.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmarPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Confirmar Contraseña
            </label>
            <Input
              id="confirmarPassword"
              type="password"
              placeholder="••••••••"
              {...register('confirmarPassword')}
              className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus-visible:ring-indigo-500"
              aria-label="Confirmar contraseña"
            />
            {errors.confirmarPassword && (
              <p className="mt-1 text-xs text-red-400">{errors.confirmarPassword.message}</p>
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
                Guardando...
              </>
            ) : (
              'Restablecer Contraseña'
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
    </div>
  );
};
