import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { DataViewer } from '../../../components/ui/DataViewer';
import { AccesoAdminResponse } from '../types/acceso.types';
import { KeyRound, X, Save } from 'lucide-react';
import { accesoService } from '../services/acceso.service';

interface AccesoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  acceso: AccesoAdminResponse | null;
}

export const AccesoDetailModal: React.FC<AccesoDetailModalProps> = ({ isOpen, onClose, acceso }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!acceso) return null;

  const handleUpdatePassword = async () => {
    if (newPassword.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres.');
      return;
    }
    
    setIsUpdating(true);
    setError(null);
    try {
      await accesoService.cambiarPasswordAdmin(acceso.idUsuario, { passwordNueva: newPassword });
      setIsEditing(false);
      setNewPassword('');
      alert('Contraseña actualizada con éxito');
    } catch (err: any) {
      setError('No se pudo actualizar la contraseña.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setNewPassword('');
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Detalles de Acceso" size="md">
      <div className="space-y-4">
        {isEditing ? (
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
                <KeyRound size={16} /> Modificar Contraseña
              </h3>
              <p className="text-xs text-gray-400 mt-1">Establece una nueva contraseña administrativa para el usuario ID {acceso.idUsuario}.</p>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Nueva Contraseña</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-blue-500/60"
                placeholder="Mínimo 8 caracteres"
              />
              {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="text-xs font-medium text-gray-400 hover:text-white transition"
              >
                Cancelar
              </button>
              <button 
                onClick={handleUpdatePassword}
                disabled={isUpdating}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
              >
                {isUpdating ? 'Guardando...' : <><Save size={14} /> Guardar</>}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end">
             <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 hover:bg-white/10 text-sm text-gray-300 transition-colors"
              >
                <KeyRound size={14} className="text-blue-400" /> Cambiar Contraseña
              </button>
          </div>
        )}

        <div className="pt-2">
          <DataViewer data={acceso} />
        </div>
      </div>
    </Modal>
  );
};
