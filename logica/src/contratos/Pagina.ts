export type ParametrosDePagina = {
  pagina: number;
  limite: number;
};

export type Pagina<T> = {
  itens: T[];
  total: number;
  pagina: number;
  limite: number;
  totalDePaginas: number;
};
