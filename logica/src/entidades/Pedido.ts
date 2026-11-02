import { ErroDeValidacao } from '../erros';
import { Entidade } from './Entidade';

export class Pedido extends Entidade {
  #clienteId = 0;
  #produtoId = 0;
  #quantidade = 1;
  #valorUnitario = 0;
  #clienteNome: string | null;
  #produtoNome: string | null;

  constructor(
    id: number | null,
    clienteId: number,
    produtoId: number,
    quantidade: number,
    valorUnitario: number,
    criadoEm?: Date,
    clienteNome: string | null = null,
    produtoNome: string | null = null
  ) {
    super(id, criadoEm);
    this.clienteId = clienteId;
    this.quantidade = quantidade;
    this.definirProduto(produtoId, valorUnitario);
    this.#clienteNome = clienteNome;
    this.#produtoNome = produtoNome;
  }

  get clienteId(): number {
    return this.#clienteId;
  }

  set clienteId(valor: number) {
    if (!Number.isInteger(valor) || valor < 1) {
      throw new ErroDeValidacao('clienteId', 'Escolha um cliente.');
    }
    this.#clienteId = valor;
  }

  get quantidade(): number {
    return this.#quantidade;
  }

  set quantidade(valor: number) {
    if (!Number.isInteger(valor) || valor < 1) {
      throw new ErroDeValidacao('quantidade', 'A quantidade precisa ser um número inteiro maior que zero.');
    }
    this.#quantidade = valor;
  }

  get produtoId(): number {
    return this.#produtoId;
  }

  get valorUnitario(): number {
    return this.#valorUnitario;
  }

  definirProduto(produtoId: number, valorUnitario: number): void {
    if (!Number.isInteger(produtoId) || produtoId < 1) {
      throw new ErroDeValidacao('produtoId', 'Escolha um produto.');
    }
    if (!Number.isFinite(valorUnitario) || valorUnitario < 0) {
      throw new ErroDeValidacao('produtoId', 'O preço do produto é inválido.');
    }

    this.#produtoId = produtoId;
    this.#valorUnitario = valorUnitario;
  }

  get total(): number {
    return Math.round(this.#quantidade * this.#valorUnitario * 100) / 100;
  }

  get clienteNome(): string | null {
    return this.#clienteNome;
  }

  get produtoNome(): string | null {
    return this.#produtoNome;
  }

  paraJSON(): Record<string, unknown> {
    return {
      ...this.dadosBasicos(),
      clienteId: this.clienteId,
      clienteNome: this.#clienteNome,
      produtoId: this.produtoId,
      produtoNome: this.#produtoNome,
      quantidade: this.quantidade,
      valorUnitario: this.valorUnitario,
      total: this.total,
    };
  }
}
