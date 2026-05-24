import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventoService } from '../services/evento.service';
import { ResumenCheckInDTO, CheckInEstadoDTO } from '../types/evento.types';
import { Loader2, QrCode, Users, CheckCircle, Clock, AlertCircle, ArrowLeft, Camera, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QRScanner } from '../components/QRScanner';

const ESTADO_POLL_INTERVAL = 30000; // 30 segundos

const CheckInPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resumen, setResumen] = useState<ResumenCheckInDTO | null>(null);
  const [estado, setEstado] = useState<CheckInEstadoDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchEstado = useCallback(async () => {
    try {
      const data = await eventoService.getCheckInEstado(Number(id));
      setEstado(data);
      return data;
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error al consultar estado del check-in' });
      return null;
    }
  }, [id]);

  const fetchResumen = async () => {
    try {
      const data = await eventoService.getCheckInResumen(Number(id));
      setResumen(data);
    } catch (err: any) {
      console.error('Error fetching resumen:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const estadoData = await fetchEstado();
      if (estadoData?.habilitado) {
        await fetchResumen();
      }
      setIsLoading(false);
    };
    if (id) init();
  }, [id, fetchEstado]);

  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      const data = await fetchEstado();
      if (data?.habilitado) {
        await fetchResumen();
        if (inputRef.current) inputRef.current.focus();
      }
    }, ESTADO_POLL_INTERVAL);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchEstado]);

  useEffect(() => {
    if (!isLoading && estado?.habilitado && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, estado]);

  const executeCheckIn = async (code: string) => {
    if (!code.trim()) return;

    setIsCheckingIn(true);
    setMessage(null);

    try {
      const response = await eventoService.checkIn(Number(id), { codigoQr: code.trim() });
      setMessage({ type: 'success', text: `Ingreso validado para: ${response.nombreAsistente}` });
      setQrInput('');
      await fetchResumen();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.response?.data?.detail || 'Error al validar ticket' });
      setQrInput('');
    } finally {
      setIsCheckingIn(false);
      setIsScannerOpen(false);
      inputRef.current?.focus();
    }
  };

  const handleCheckInFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    executeCheckIn(qrInput);
  };

  const handleScanSuccess = (decodedText: string) => {
    setQrInput(decodedText);
    executeCheckIn(decodedText);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const habilitado = estado?.habilitado ?? false;

  return (
    <div className="min-h-screen bg-gray-950 p-4 pb-20">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between mt-8 mb-8 bg-gray-900/30 border border-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <QrCode className="text-indigo-400" size={28} />
            Check-in: {estado?.nombreEvento || `Evento #${id}`}
          </h1>
          <p className="text-gray-400">
            Escanea el codigo QR de los asistentes para validar su ingreso.
          </p>
        </div>
        <Link
          to="/asignaciones"
          className="mt-4 md:mt-0 flex items-center gap-2 bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 border border-white/10 font-medium py-2 px-5 rounded-xl transition-all duration-300"
        >
          <ArrowLeft size={16} />
          Volver a Asignaciones
        </Link>
      </div>

      {/* ===== WAITING SCREEN ===== */}
      {!habilitado && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/40 border border-amber-500/20 rounded-2xl p-8 text-center space-y-4">
            <Clock className="mx-auto text-amber-400" size={48} />
            <h2 className="text-xl font-bold text-amber-400">Check-in no disponible</h2>
            <p className="text-gray-300">{estado?.motivo || 'El check-in no esta habilitado en este momento.'}</p>
            {estado?.aperturaCheckin && (
              <p className="text-sm text-gray-500">
                Se habilitara el {new Date(estado.aperturaCheckin).toLocaleDateString('es-CO', {
                  day: '2-digit', month: 'long', year: 'numeric',
                })}{' '}
                a las{' '}
                {new Date(estado.aperturaCheckin).toLocaleTimeString('es-CO', {
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            )}
            <p className="text-xs text-gray-600">Reintentando automaticamente cada 30 segundos...</p>
          </div>
        </div>
      )}

      {/* ===== CHECK-IN ACTIVE ===== */}
      {habilitado && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900/40 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <QrCode size={20} className="text-indigo-400" />
                Lector QR
              </h2>
              <button
                onClick={() => setIsScannerOpen(!isScannerOpen)}
                className="flex items-center gap-2 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
              >
                {isScannerOpen ? (
                  <><X size={16} /> Cerrar Camara</>
                ) : (
                  <><Camera size={16} /> Usar Camara</>
                )}
              </button>
            </div>

            {isScannerOpen && (
              <div className="mb-4 bg-black rounded-xl border border-gray-800 overflow-hidden">
                <QRScanner
                  onScanSuccess={handleScanSuccess}
                  onScanFailure={() => {}}
                />
              </div>
            )}

            <form onSubmit={handleCheckInFormSubmit} className="space-y-4">
              <div>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Escanea con pistola o escribe el codigo..."
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  disabled={isCheckingIn}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={isCheckingIn || !qrInput.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isCheckingIn ? <Loader2 size={18} className="animate-spin" /> : 'Validar Ingreso'}
              </button>
            </form>

            {message && (
              <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 ${
                message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>
                {message.type === 'success' ? <CheckCircle size={24} className="shrink-0" /> : <AlertCircle size={24} className="shrink-0" />}
                <p className="font-medium">{message.text}</p>
              </div>
            )}
          </div>

          <div className="bg-gray-900/40 border border-white/10 rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users size={20} className="text-indigo-400" />
              Resumen de Ingreso
            </h2>

            {resumen && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Progreso</span>
                    <span>{resumen.porcentajeIngreso.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                      style={{ width: `${resumen.porcentajeIngreso}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-gray-950 border border-white/5 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-white mb-1">{resumen.totalIngresados}</div>
                    <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                      <CheckCircle size={14} className="text-green-500" />
                      Ingresados
                    </div>
                  </div>
                  <div className="bg-gray-950 border border-white/5 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-white mb-1">{resumen.totalPendientes}</div>
                    <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                      <Clock size={14} className="text-orange-500" />
                      Pendientes
                    </div>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <span className="text-sm text-gray-500">Total inscritos validos: {resumen.totalInscritos}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInPage;
