import React from 'react';
import {
  Clock, RotateCcw, CheckCircle, XCircle,
  Ban, AlertTriangle, HelpCircle,
} from 'lucide-react';
import { EstadoSolicitudReembolso } from '../types/reembolso.types';

interface ReembolsoStatusBadgeProps {
  estado: EstadoSolicitudReembolso;
  className?: string;
}

const CONFIG: Record<string, { icon: React.ReactNode; style: string; label: string }> = {
  SOLICITADA: {
    icon: <Clock size={12} />,
    style: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    label: 'Solicitada',
  },
  EN_REVISION: {
    icon: <RotateCcw size={12} />,
    style: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    label: 'En Revision',
  },
  APROBADA: {
    icon: <CheckCircle size={12} />,
    style: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    label: 'Aprobada',
  },
  RECHAZADA: {
    icon: <XCircle size={12} />,
    style: 'text-red-400 bg-red-500/10 border-red-500/30',
    label: 'Rechazada',
  },
  CANCELADA: {
    icon: <Ban size={12} />,
    style: 'text-gray-400 bg-gray-500/10 border-gray-500/30',
    label: 'Cancelada',
  },
  REEMBOLSADA: {
    icon: <CheckCircle size={12} />,
    style: 'text-green-400 bg-green-500/10 border-green-500/30',
    label: 'Reembolsada',
  },
  PROCESADA: {
    icon: <CheckCircle size={12} />,
    style: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    label: 'Procesada (H)',
  },
  FALLIDA: {
    icon: <AlertTriangle size={12} />,
    style: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    label: 'Fallida (H)',
  },
};

const DEFAULT_CONFIG = {
  icon: <HelpCircle size={12} />,
  style: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
  label: 'Desconocido',
};

export const ReembolsoStatusBadge: React.FC<ReembolsoStatusBadgeProps> = ({ estado, className = '' }) => {
  const cfg = CONFIG[estado] || DEFAULT_CONFIG;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.style} ${className}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
};
