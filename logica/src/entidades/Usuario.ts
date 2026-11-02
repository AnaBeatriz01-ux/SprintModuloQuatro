import { ErroDeValidacao } from '../erros';
import { cpfEhValido, exigirSenhaAceitavel, somenteNumeros } from '../validadores';
import type { Criptografia } from '../contratos';
import { Pessoa } from './Pessoa';

export class Usuario extends Pessoa {
  #cpf = '';
  #senhaHash: string | null;

  constructor(
    id: number | null,
    nome: string,
    email: string,
    cpf: string,
    senhaHash: string | null = null,
    criadoEm?: Date
  ) {
    super(id, nome, email, criadoEm);
    this.cpf = cpf;
    this.#senhaHash = senhaHash;
  }

  get cpf(): string {
    return this.#cpf;
  }

  set cpf(valor: string) {
    const numeros = somenteNumeros(valor);

    if (numeros === '') {
      throw new ErroDeValidacao('cpf', 'O CPF é obrigatório.');
    }
    if (!cpfEhValido(numeros)) {
      throw new ErroDeValidacao('cpf', 'CPF inválido.');
    }

    this.#cpf = numeros;
  }

  async definirSenha(senha: string, criptografia: Criptografia): Promise<void> {
    exigirSenhaAceitavel(senha);
    this.#senhaHash = await criptografia.gerarHash(senha);
  }

  async conferirSenha(senha: string, criptografia: Criptografia): Promise<boolean> {
    if (this.#senhaHash === null) return false;
    return criptografia.comparar(senha, this.#senhaHash);
  }

  paraPersistencia(): { nome: string; email: string; cpf: string; senhaHash: string } {
    if (this.#senhaHash === null) {
      throw new Error('Não dá pra salvar um usuário sem senha.');
    }
    return { nome: this.nome, email: this.email, cpf: this.cpf, senhaHash: this.#senhaHash };
  }

  paraJSON(): Record<string, unknown> {
    return { ...this.dadosBasicos(), nome: this.nome, email: this.email, cpf: this.cpf };
  }
}
