export function formatCurrencyCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function getMedioReembolsoLabel(medio: string): string {
  const map: Record<string, string> = {
    CUENTA_BANCARIA: 'Cuenta Bancaria',
    NEQUI: 'Nequi',
    DAVIPLATA: 'Daviplata',
    OTRO: 'Otro',
  };
  return map[medio] || medio;
}

export function getTipoCuentaLabel(tipo: string): string {
  const map: Record<string, string> = {
    AHORROS: 'Ahorros',
    CORRIENTE: 'Corriente',
  };
  return map[tipo] || tipo;
}

export function getNumeroCuentaLabel(medio: string): string {
  const map: Record<string, string> = {
    CUENTA_BANCARIA: 'Numero de cuenta',
    NEQUI: 'Numero asociado a Nequi',
    DAVIPLATA: 'Numero asociado a Daviplata',
    OTRO: 'Numero o referencia del medio de reembolso',
  };
  return map[medio] || 'Numero o referencia';
}
