import { ErroDeValidacao } from '../erros';
import { Entidade } from './Entidade';

export class Categoria extends Entidade {
  #nome = '';

  constructor(id: number | null, nome: string, criadoEm?: Date) {
    super(id, criadoEm);
    this.nome = nome;
  }

  get nome(): string {
    return this.#nome;
  }

  set nome(valor: string) {
    const limpo = valor.trim();

    if (limpo === '') {
      throw new ErroDeValidacao('nome', 'O nome da categoria não pode ficar vazio.');
    }
    if (limpo.length > 80) {
      throw new ErroDeValidacao('nome', 'O nome da categoria pode ter no máximo 80 letras.');
    }

    this.#nome = limpo;
  }

  paraJSON(): Record<string, unknown> {
    return { ...this.dadosBasicos(), nome: this.nome };
  }
}
