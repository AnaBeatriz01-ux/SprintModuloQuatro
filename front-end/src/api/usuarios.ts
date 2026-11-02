import { requisitar } from './cliente';

export type DadosDoUsuario = {
  nome: string;
  email: string;
  cpf: string;
  senha: string;
};

export type UsuarioCriado = {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  criadoEm: string;
};

export function cadastrarUsuario(dados: DadosDoUsuario): Promise<UsuarioCriado> {
  return requisitar<UsuarioCriado>('POST', '/usuarios', dados);
}
