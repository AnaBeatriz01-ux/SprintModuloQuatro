import { ErroDeAplicacao } from './ErroDeAplicacao';

export class ErroDeConflito extends ErroDeAplicacao {
  readonly statusHttp = 409;

  constructor(mensagem: string, campo?: string) {
    super(mensagem, campo);
  }
}
