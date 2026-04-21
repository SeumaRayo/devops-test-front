import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { loginSchema } from '../validations/auth.schema';
import { useLogin } from '../hooks/useLogin';
import { LoginRequest } from '../types/auth.types';

export default function LoginForm() {
  const { loginUser, isLoading, error } = useLogin();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data: LoginRequest) => {
    loginUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-sm">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Bienvenido de vuelta</h2>
        <p className="text-sm text-gray-400 mt-2">Ingresa tus credenciales para continuar</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Usuario o Correo</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
              <Mail size={18} />
            </div>
            <input
              type="text"
              className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${errors.usernameOrEmail ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-indigo-500'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all backdrop-blur-md`}
              placeholder="tu@correo.com o username"
              {...register('usernameOrEmail')}
            />
          </div>
          {errors.usernameOrEmail && <p className="mt-1.5 text-xs text-red-400 ml-1">{errors.usernameOrEmail.message}</p>}
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Contraseña</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
              <Lock size={18} />
            </div>
            <input
              type="password"
              className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-indigo-500'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all backdrop-blur-md`}
              placeholder="••••••••"
              {...register('password')}
            />
          </div>
          {errors.password && <p className="mt-1.5 text-xs text-red-400 ml-1">{errors.password.message}</p>}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
        <span className="relative flex items-center gap-2">
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Iniciar Sesión'}
          {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
        </span>
      </button>
    </form>
  );
}
