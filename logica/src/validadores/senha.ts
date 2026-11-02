import { ErroDeValidacao } from '../erros';

export type NivelDaSenha = 'fraca' | 'media' | 'forte';

export function nivelDaSenha(senha: string): NivelDaSenha {
  if (senha.length < 8) return 'fraca';

  let tipos = 0;
  if (/[a-z]/.test(senha)) tipos++;
  if (/[A-Z]/.test(senha)) tipos++;
  if (/[0-9]/.test(senha)) tipos++;
  if (/[^a-zA-Z0-9]/.test(senha)) tipos++;

  if (tipos <= 2) return 'fraca';
  if (tipos === 3) return 'media';
  return 'forte';
}

export const MENSAGEM_DE_SENHA_FRACA =
  'Senha fraca. Use 8 caracteres ou mais, misturando pelo menos 3 destes: minúscula, maiúscula, número e símbolo.';

export function exigirSenhaAceitavel(senha: string): void {
  if (senha === '') {
    throw new ErroDeValidacao('senha', 'A senha é obrigatória.');
  }
  if (nivelDaSenha(senha) === 'fraca') {
    throw new ErroDeValidacao('senha', MENSAGEM_DE_SENHA_FRACA);
  }
}
