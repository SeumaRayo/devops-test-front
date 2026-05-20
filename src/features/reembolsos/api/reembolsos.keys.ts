export const reembolsosKeys = {
  all: ['reembolsos'] as const,
  misSolicitudes: () => [...reembolsosKeys.all, 'mis-solicitudes'] as const,
  detalle: (id: number) => [...reembolsosKeys.all, 'detalle', id] as const,
  evento: (eventoId: number) => [...reembolsosKeys.all, 'evento', eventoId] as const,
  eventoDetalle: (eventoId: number, id: number) =>
    [...reembolsosKeys.all, 'evento', eventoId, 'detalle', id] as const,
};
