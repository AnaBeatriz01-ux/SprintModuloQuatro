import { ErroDeAplicacao } from './ErroDeAplicacao';

export class ErroNaoEncontrado extends ErroDeAplicacao {
  readonly statusHttp = 404;

  constructor(recurso: string, id: number) {
    super(`Não existe ${recurso} com o id ${id}.`);
  }
}
