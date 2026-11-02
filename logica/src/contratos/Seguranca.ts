export interface Criptografia {
  gerarHash(senha: string): Promise<string>;
  comparar(senha: string, hash: string): Promise<boolean>;
}
