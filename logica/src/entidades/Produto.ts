import { ErroDeValidacao } from '../erros';
import { Entidade } from './Entidade';

export class Produto extends Entidade {
  #nome = '';
  #descricao = '';
  #preco = 0;
  #categoriaId = 0;
  #categoriaNome: string | null;

  constructor(
    id: number | null,
    nome: string,
    descricao: string,
    preco: number,
    categoriaId: number,
    criadoEm?: Date,
    categoriaNome: string | null = null
  ) {
    super(id, criadoEm);
    this.nome = nome;
    this.descricao = descricao;
    this.preco = preco;
    this.categoriaId = categoriaId;
    this.#categoriaNome = categoriaNome;
  }

  get nome(): string {
    return this.#nome;
  }

  set nome(valor: string) {
    const limpo = valor.trim();

    if (limpo === '') {
      throw new ErroDeValidacao('nome', 'O nome do produto não pode ficar vazio.');
    }
    if (limpo.length > 120) {
      throw new ErroDeValidacao('nome', 'O nome do produto pode ter no máximo 120 letras.');
    }

    this.#nome = limpo;
  }

  get descricao(): string {
    return this.#descricao;
  }

  set descricao(valor: string) {
    const limpo = valor.trim();

    if (limpo.length > 255) {
      throw new ErroDeValidacao('descricao', 'A descrição pode ter no máximo 255 letras.');
    }

    this.#descricao = limpo;
  }

  get preco(): number {
    return this.#preco;
  }

  set preco(valor: number) {
    if (!Number.isFinite(valor) || valor < 0) {
      throw new ErroDeValidacao('preco', 'O preço precisa ser um número maior ou igual a zero.');
    }

    this.#preco = Math.round(valor * 100) / 100;
  }

  get categoriaId(): number {
    return this.#categoriaId;
  }

  set categoriaId(valor: number) {
    if (!Number.isInteger(valor) || valor < 1) {
      throw new ErroDeValidacao('categoriaId', 'Escolha uma categoria.');
    }

    this.#categoriaId = valor;
  }

  paraJSON(): Record<string, unknown> {
    return {
      ...this.dadosBasicos(),
      nome: this.nome,
      descricao: this.descricao,
      preco: this.preco,
      categoriaId: this.categoriaId,
      categoriaNome: this.#categoriaNome,
    };
  }
}
