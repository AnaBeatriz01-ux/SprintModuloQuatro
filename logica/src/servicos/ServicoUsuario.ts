import type { Criptografia, RepositorioDeUsuarios } from '../contratos';
import { Usuario } from '../entidades';
import { ErroDeConflito } from '../erros';
import { texto } from '../utils';

export type DadosDeUsuario = {
  nome?: unknown;
  email?: unknown;
  cpf?: unknown;
  senha?: unknown;
};

export class ServicoUsuario {
  constructor(
    private readonly repositorio: RepositorioDeUsuarios,
    private readonly criptografia: Criptografia
  ) {}

  async cadastrar(dados: DadosDeUsuario): Promise<Usuario> {
    const usuario = new Usuario(null, texto(dados.nome), texto(dados.email), texto(dados.cpf));
    await usuario.definirSenha(texto(dados.senha), this.criptografia);

    await this.garantirEmailLivre(usuario.email);
    await this.garantirCpfLivre(usuario.cpf);

    return this.repositorio.criar(usuario);
  }

  private async garantirEmailLivre(email: string): Promise<void> {
    if ((await this.repositorio.buscarPorEmail(email)) !== null) {
      throw new ErroDeConflito('Já existe uma conta com esse e-mail.', 'email');
    }
  }

  private async garantirCpfLivre(cpf: string): Promise<void> {
    if ((await this.repositorio.buscarPorCpf(cpf)) !== null) {
      throw new ErroDeConflito('Já existe uma conta com esse CPF.', 'cpf');
    }
  }
}
