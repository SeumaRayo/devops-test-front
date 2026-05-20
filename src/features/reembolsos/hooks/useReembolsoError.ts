import { toast } from 'sonner';

export function useReembolsoError() {
  const handle = (err: unknown) => {
    if (!err || typeof err !== 'object') {
      toast.error('Ocurrio un error inesperado.');
      return;
    }
    const e = err as Record<string, any>;
    const status = e?.status ?? e?.response?.status;
    const backendMsg = e?.response?.data?.message || e?.response?.data?.detail;

    switch (status) {
      case 400:
        toast.error(backendMsg || 'La solicitud no es valida.');
        break;
      case 403:
        toast.error('No tienes permisos para realizar esta accion.');
        break;
      case 404:
        toast.error('No se encontro la solicitud de reembolso.');
        break;
      case 409:
        toast.error('La solicitud fue modificada por otra operacion. Actualiza la pagina e intenta nuevamente.');
        break;
      default:
        toast.error(backendMsg || 'Ocurrio un error inesperado. Intenta mas tarde.');
    }
  };

  return { handleError: handle };
}
