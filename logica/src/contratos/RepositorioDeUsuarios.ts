import type { Usuario } from '../entidades/Usuario';
import type { Repositorio } from './Repositorio';

export interface RepositorioDeUsuarios extends Repositorio<Usuario> {
  buscarPorEmail(email: string): Promise<Usuario | null>;
  buscarPorCpf(cpf: string): Promise<Usuario | null>;
}
