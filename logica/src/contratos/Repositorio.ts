import type { Entidade } from '../entidades/Entidade';
import type { Pagina, ParametrosDePagina } from './Pagina';

export interface Repositorio<T extends Entidade> {
  listar(parametros: ParametrosDePagina): Promise<Pagina<T>>;
  listarTodos(): Promise<T[]>;
  buscarPorId(id: number): Promise<T | null>;
  criar(entidade: T): Promise<T>;
  atualizar(entidade: T): Promise<T>;
  excluir(id: number): Promise<void>;
}
