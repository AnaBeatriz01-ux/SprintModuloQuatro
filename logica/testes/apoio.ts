import type { Criptografia, Pagina, ParametrosDePagina, Repositorio, RepositorioDeUsuarios } from '../src/contratos';
import { Usuario } from '../src/entidades';
import type { Entidade } from '../src/entidades';
import { montarPagina } from '../src/utils';

export class RepositorioEmMemoria<T extends Entidade> implements Repositorio<T> {
  protected itens: T[] = [];
  #proximoId = 1;

  constructor(private readonly comId: (entidade: T, id: number) => T) {}

  async listar(parametros: ParametrosDePagina): Promise<Pagina<T>> {
    const inicio = (parametros.pagina - 1) * parametros.limite;
    const fatia = this.itens.slice(inicio, inicio + parametros.limite);
    return montarPagina(fatia, this.itens.length, parametros);
  }

  async listarTodos(): Promise<T[]> {
    return [...this.itens];
  }

  async buscarPorId(id: number): Promise<T | null> {
    return this.itens.find((item) => item.id === id) ?? null;
  }

  async criar(entidade: T): Promise<T> {
    const salva = this.comId(entidade, this.#proximoId++);
    this.itens.push(salva);
    return salva;
  }

  async atualizar(entidade: T): Promise<T> {
    this.itens = this.itens.map((item) => (item.id === entidade.id ? entidade : item));
    return entidade;
  }

  async excluir(id: number): Promise<void> {
    this.itens = this.itens.filter((item) => item.id !== id);
  }
}

export class RepositorioDeUsuariosEmMemoria extends RepositorioEmMemoria<Usuario> implements RepositorioDeUsuarios {
  constructor() {
    super((usuario, id) => {
      const dados = usuario.paraPersistencia();
      return new Usuario(id, dados.nome, dados.email, dados.cpf, dados.senhaHash, usuario.criadoEm);
    });
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.itens.find((u) => u.email === email) ?? null;
  }

  async buscarPorCpf(cpf: string): Promise<Usuario | null> {
    return this.itens.find((u) => u.cpf === cpf) ?? null;
  }
}

export class CriptografiaFalsa implements Criptografia {
  async gerarHash(senha: string): Promise<string> {
    return `hash(${senha})`;
  }

  async comparar(senha: string, hash: string): Promise<boolean> {
    return hash === `hash(${senha})`;
  }
}

export const CPF_VALIDO = '529.982.247-25';
export const SENHA_BOA = 'Senha@123';
