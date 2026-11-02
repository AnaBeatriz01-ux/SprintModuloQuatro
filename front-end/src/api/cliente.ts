const URL_DA_API: string = import.meta.env.VITE_URL_DA_API ?? 'http://localhost:3000/api';

export class ErroDaApi extends Error {
  readonly status: number;
  readonly campo?: string;

  constructor(mensagem: string, status: number, campo?: string) {
    super(mensagem);
    this.name = 'ErroDaApi';
    this.status = status;
    this.campo = campo;
  }
}

export function mensagemDoErro(erro: unknown): string {
  return erro instanceof Error ? erro.message : 'Algo deu errado. Tente de novo.';
}

type Metodo = 'GET' | 'POST';

type CorpoDeErro = {
  erro?: string;
  campo?: string;
};

export async function requisitar<T>(metodo: Metodo, caminho: string, corpo?: unknown): Promise<T> {
  let resposta: Response;

  try {
    resposta = await fetch(`${URL_DA_API}${caminho}`, {
      method: metodo,
      headers: corpo === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch {
    throw new ErroDaApi('Não foi possível falar com o servidor. Confira se a API está rodando.', 0);
  }

  const dados: unknown = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    const corpoDeErro = (dados ?? {}) as CorpoDeErro;
    throw new ErroDaApi(corpoDeErro.erro ?? 'Algo deu errado. Tente de novo.', resposta.status, corpoDeErro.campo);
  }

  return dados as T;
}
