import React from 'react';
import { DatosReembolsoResponse, MedioReembolso } from '../types/reembolso.types';
import { getMedioReembolsoLabel, getTipoCuentaLabel } from '../services/reembolso.helpers';
import { Shield, User, Phone, Mail, Building, CreditCard, EyeOff } from 'lucide-react';

interface DatosReembolsoResumenProps {
  datos: DatosReembolsoResponse | null;
}

const Dato: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-2">
    <span className="text-gray-500 mt-0.5 shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-[10px] text-gray-500 uppercase font-medium">{label}</p>
      <p className="text-xs text-gray-300 truncate">{value}</p>
    </div>
  </div>
);

export const DatosReembolsoResumen: React.FC<DatosReembolsoResumenProps> = ({ datos }) => {
  if (!datos) {
    return (
      <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3">
        <p className="text-xs text-amber-400/80">
          Esta solicitud fue creada antes de que se solicitaran datos de reembolso.
        </p>
      </div>
    );
  }

  const medio = datos.medioReembolso as MedioReembolso;

  return (
    <div className="bg-gray-800/30 border border-white/5 rounded-xl p-3.5 space-y-3">
      <h4 className="text-xs text-gray-400 uppercase font-semibold tracking-wider flex items-center gap-1.5">
        <Shield size={12} />
        Datos para el reembolso
      </h4>

      <div className="grid grid-cols-2 gap-3">
        <Dato icon={<CreditCard size={12} />} label="Medio" value={getMedioReembolsoLabel(medio)} />
        <Dato icon={<User size={12} />} label="Titular" value={datos.titularCuenta} />
      </div>

      <Dato icon={<User size={12} />} label="Documento del titular" value={datos.documentoTitular} />

      {datos.entidadFinanciera && (
        <Dato icon={<Building size={12} />} label="Entidad" value={datos.entidadFinanciera} />
      )}

      {datos.tipoCuenta && (
        <Dato icon={<CreditCard size={12} />} label="Tipo de cuenta" value={getTipoCuentaLabel(datos.tipoCuenta)} />
      )}

      {datos.numeroCuentaEnmascarado && (
        <Dato
          icon={<EyeOff size={12} />}
          label="Cuenta (enmascarada)"
          value={datos.numeroCuentaEnmascarado}
        />
      )}

      <Dato icon={<Mail size={12} />} label="Correo de contacto" value={datos.correoContacto} />
      <Dato icon={<Phone size={12} />} label="Telefono" value={datos.telefonoContacto} />

      {datos.observaciones && (
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-medium mb-1">Observaciones</p>
          <p className="text-xs text-gray-400">{datos.observaciones}</p>
        </div>
      )}
    </div>
  );
};
