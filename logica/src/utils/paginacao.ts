import type { Pagina, ParametrosDePagina } from '../contratos/Pagina';
import { numero } from './entrada';

export const LIMITE_PADRAO = 10;
export const LIMITE_MAXIMO = 100;

export function normalizarPagina(pagina: unknown, limite: unknown): ParametrosDePagina {
  const p = Math.floor(numero(pagina));
  const l = Math.floor(numero(limite));

  return {
    pagina: Number.isFinite(p) && p >= 1 ? p : 1,
    limite: Number.isFinite(l) && l >= 1 ? Math.min(l, LIMITE_MAXIMO) : LIMITE_PADRAO,
  };
}

export function montarPagina<T>(itens: T[], total: number, parametros: ParametrosDePagina): Pagina<T> {
  return {
    itens,
    total,
    pagina: parametros.pagina,
    limite: parametros.limite,
    totalDePaginas: Math.max(1, Math.ceil(total / parametros.limite)),
  };
}
