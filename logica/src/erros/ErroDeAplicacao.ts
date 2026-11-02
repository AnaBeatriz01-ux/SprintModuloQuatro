export abstract class ErroDeAplicacao extends Error {
  abstract readonly statusHttp: number;

  readonly campo?: string;

  constructor(mensagem: string, campo?: string) {
    super(mensagem);
    this.name = new.target.name;
    this.campo = campo;
  }
}
