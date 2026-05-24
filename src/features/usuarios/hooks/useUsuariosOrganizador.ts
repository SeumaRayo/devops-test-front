import { useQuery } from '@tanstack/react-query';
import { usuarioService } from '../services/usuario.service';
import { UsuarioOrganizadorResponse } from '../types/usuario.types';

export function useUsuariosOrganizador() {
  return useQuery({
    queryKey: ['usuarios', 'organizador', 'all'],
    queryFn: async () => {
      const data = await usuarioService.buscarUsuariosOrganizador({ size: 200 });
      const map = new Map<number, UsuarioOrganizadorResponse>();
      for (const u of data.content) {
        map.set(u.idUsuario, u);
      }
      return map;
    },
    staleTime: 2 * 60 * 1000,
  });
}
