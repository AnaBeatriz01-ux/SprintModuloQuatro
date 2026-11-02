import { ErroDeAplicacao } from './ErroDeAplicacao';

export class ErroDeValidacao extends ErroDeAplicacao {
  readonly statusHttp = 400;

  constructor(campo: string, mensagem: string) {
    super(mensagem, campo);
  }
}
