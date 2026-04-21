// Generic Spring Page wrapper for pagination
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export type EstadoEvento = 'BORRADOR' | 'PUBLICADO' | 'CERRADO' | 'CANCELADO';
export type Estado = 'ACTIVO' | 'INACTIVO';

export interface EventoResponse {
  idEvento: number;
  idUsuarioCreador: number;
  nombreEvento: string;
  descripcionEvento: string;
  fechaEvento: string; // YYYY-MM-DD
  horaEvento: string;  // HH:MM:SS
  lugarEvento: string;
  referenciaUbicacion: string;
  imagenUrl: string;
  estadoEvento: EstadoEvento;
  capacidadMaxima: number;
  tieneParqueadero: boolean;
  cuposParqueadero: number;
  estado: Estado;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreateEventoRequest {
  nombreEvento: string;
  descripcionEvento?: string;
  fechaEvento: string;
  horaEvento: string;
  lugarEvento: string;
  referenciaUbicacion?: string;
  imagenUrl?: string;
  capacidadMaxima: number;
  tieneParqueadero: boolean;
  cuposParqueadero?: number;
}

export interface UpdateEventoRequest {
  nombreEvento?: string;
  descripcionEvento?: string;
  fechaEvento?: string;
  horaEvento?: string;
  lugarEvento?: string;
  referenciaUbicacion?: string;
  imagenUrl?: string;
  capacidadMaxima?: number;
  tieneParqueadero?: boolean;
  cuposParqueadero?: number;
}

export interface HistorialEventoResponse {
  idHistorialEvento: number;
  estadoAnterior: EstadoEvento | null;
  estadoNuevo: EstadoEvento;
  comentario: string;
  idUsuarioResponsable: number;
  nombreUsuarioResponsable: string;
  fechaCambio: string; // ISO-8601
}

export interface ComentarioRequest {
  comentario: string;
}

export interface EventoFilterRequest {
  page?: number;
  size?: number;
  estadoEvento?: EstadoEvento;
  estado?: Estado;
  nombre?: string;
  lugar?: string;
  usuarioCreador?: number;
  fechaInicio?: string;
  fechaFin?: string;
}
