import { ErroDeValidacao } from '../erros';
import { emailEhValido } from '../validadores';
import { Entidade } from './Entidade';

export abstract class Pessoa extends Entidade {
  #nome = '';
  #email: string;

  constructor(id: number | null, nome: string, email: string, criadoEm?: Date) {
    super(id, criadoEm);
    this.nome = nome;
    this.#email = Pessoa.validarEmail(email);
  }

  get nome(): string {
    return this.#nome;
  }

  set nome(valor: string) {
    const limpo = valor.trim();

    if (limpo.length < 3) {
      throw new ErroDeValidacao('nome', 'O nome precisa ter pelo menos 3 letras.');
    }
    if (limpo.length > 120) {
      throw new ErroDeValidacao('nome', 'O nome pode ter no máximo 120 letras.');
    }

    this.#nome = limpo;
  }

  get email(): string {
    return this.#email;
  }

  private static validarEmail(valor: string): string {
    const limpo = valor.trim().toLowerCase();

    if (limpo === '') {
      throw new ErroDeValidacao('email', 'O e-mail é obrigatório.');
    }
    if (!emailEhValido(limpo)) {
      throw new ErroDeValidacao('email', 'Digite um e-mail válido.');
    }

    return limpo;
  }
}
