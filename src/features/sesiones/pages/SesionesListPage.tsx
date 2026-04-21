import React, { useEffect } from 'react';
import { Search, ShieldAlert } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable, ColumnDef } from '../../../components/ui/DataTable';
import { Badge } from '../../../components/ui/Badge';
import { useSesiones } from '../hooks/useSesiones';
import { SesionResponseDto } from '../types/sesion.types';

export default function SesionesListPage() {
  const { sesiones, pagination, isLoading, error, fetch, applyFilters, deleteSesion } = useSesiones();

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleDelete = (idSesion: number) => {
    if (confirm('¿Estás seguro de forzar el cierre de esta sesión? Esto invalidará el token del usuario.')) {
      deleteSesion(idSesion);
    }
  };

  const columns: ColumnDef<SesionResponseDto>[] = [
    { header: 'ID', accessor: 'idSesion', className: 'w-16 text-gray-500' },
    {
      header: 'Usuario',
      accessor: 'idUsuario',
      render: (_, row) => (
        <div>
          <p className="font-medium text-white">{row.nombresUsuario} {row.apellidosUsuario}</p>
          <p className="text-xs text-gray-400 mt-0.5">ID User: {row.idUsuario}</p>
        </div>
      ),
    },
    {
      header: 'Fecha Inicio',
      accessor: 'fechaInicio',
      render: (value) => <span className="text-sm text-gray-300">{new Date(String(value)).toLocaleString()}</span>,
    },
    {
      header: 'Fecha Cierre',
      accessor: 'fechaFin',
      render: (value) => value ? <span className="text-sm text-gray-400">{new Date(String(value)).toLocaleString()}</span> : <span className="text-sm text-gray-600">—</span>,
    },
    {
      header: 'Estado',
      accessor: 'activa',
      render: (value) => <Badge status={value ? 'ACTIVA' : 'INACTIVA'} />,
    },
    {
      header: 'Identificador (JTI)',
      accessor: 'tokenJti',
      render: (value) => <span className="text-xs text-gray-500 font-mono" title={String(value)}>{String(value).split('-')[0]}...</span>,
    },
    {
      header: 'Acciones',
      accessor: 'idSesion',
      render: (_, row) => row.activa && (
        <button
          onClick={() => handleDelete(row.idSesion)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-400/10 border border-red-400/20 rounded-md hover:bg-red-400/20 transition-colors"
        >
          <ShieldAlert size={14} /> Desconectar
        </button>
      ),
    },
  ];

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
      <PageHeader
        title="Auditoría de Sesiones"
        subtitle="Monitoreo de accesos y revocación de JWT tokens."
      />

      <div className="mb-6 flex flex-wrap gap-4 items-center">
         <div className="flex items-center gap-2 text-sm text-gray-400">
            <Search size={16} /> Filtros:
         </div>
         <select
            className="bg-gray-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300 outline-none"
            onChange={(e) => {
              const val = e.target.value;
              applyFilters({ activa: val === '' ? undefined : val === 'true' });
            }}
         >
            <option value="">Todas las Sesiones</option>
            <option value="true">Activas</option>
            <option value="false">Cerradas</option>
         </select>
         <input 
            type="number"
            placeholder="ID Usuario"
            className="bg-gray-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300 outline-none placeholder-gray-600 w-32"
            onChange={(e) => {
               const val = e.target.value;
               applyFilters({ idUsuario: val ? Number(val) : undefined });
            }}
         />
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={sesiones}
        pagination={pagination}
        isLoading={isLoading}
        emptyMessage="No se encontraron sesiones."
        keyExtractor={(row) => String(row.idSesion)}
      />
    </div>
  );
}
