import { ErroDeValidacao } from '../erros';
import { Pessoa } from './Pessoa';

export class Cliente extends Pessoa {
  #telefone = '';

  constructor(id: number | null, nome: string, email: string, telefone: string, criadoEm?: Date) {
    super(id, nome, email, criadoEm);
    this.telefone = telefone;
  }

  get telefone(): string {
    return this.#telefone;
  }

  set telefone(valor: string) {
    const limpo = valor.trim();

    if (limpo.length > 20) {
      throw new ErroDeValidacao('telefone', 'O telefone pode ter no máximo 20 caracteres.');
    }

    this.#telefone = limpo;
  }

  paraJSON(): Record<string, unknown> {
    return { ...this.dadosBasicos(), nome: this.nome, email: this.email, telefone: this.telefone };
  }
}
