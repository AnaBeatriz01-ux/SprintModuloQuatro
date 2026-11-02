export type LinhaDeVenda = {
  pedidoId: number;
  data: string;
  clienteNome: string;
  produtoNome: string;
  categoriaNome: string;
  precoUnitario: number;
  quantidade: number;
  total: number;
};

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}

export function faturamentoTotal(vendas: LinhaDeVenda[]): number {
  return arredondar(vendas.reduce((soma, venda) => soma + venda.total, 0));
}

export function ticketMedio(vendas: LinhaDeVenda[]): number {
  if (vendas.length === 0) return 0;
  return arredondar(faturamentoTotal(vendas) / vendas.length);
}

export type UnidadesPorProduto = {
  produto: string;
  unidades: number;
  preco: number;
};

export function unidadesPorProduto(vendas: LinhaDeVenda[]): UnidadesPorProduto[] {
  const grupos = new Map<string, { unidades: number; somaDosPrecos: number; pedidos: number }>();

  for (const venda of vendas) {
    const grupo = grupos.get(venda.produtoNome) ?? { unidades: 0, somaDosPrecos: 0, pedidos: 0 };
    grupo.unidades += venda.quantidade;
    grupo.somaDosPrecos += venda.precoUnitario;
    grupo.pedidos += 1;
    grupos.set(venda.produtoNome, grupo);
  }

  return [...grupos.entries()]
    .map(([produto, grupo]) => ({
      produto,
      unidades: grupo.unidades,
      preco: arredondar(grupo.somaDosPrecos / grupo.pedidos),
    }))
    .sort((a, b) => b.unidades - a.unidades);
}

export function produtoMaisVendido(vendas: LinhaDeVenda[]): UnidadesPorProduto | null {
  return unidadesPorProduto(vendas)[0] ?? null;
}

export type FaturamentoDoMes = {
  mes: string;
  rotulo: string;
  faturamento: number;
  pedidos: number;
};

export function faturamentoPorMes(vendas: LinhaDeVenda[]): FaturamentoDoMes[] {
  const grupos = new Map<string, { faturamento: number; pedidos: number }>();

  for (const venda of vendas) {
    const mes = venda.data.slice(0, 7);
    const grupo = grupos.get(mes) ?? { faturamento: 0, pedidos: 0 };
    grupo.faturamento += venda.total;
    grupo.pedidos += 1;
    grupos.set(mes, grupo);
  }

  return [...grupos.entries()]
    .sort(([mesA], [mesB]) => mesA.localeCompare(mesB))
    .map(([mes, grupo]) => ({
      mes,
      rotulo: `${mes.slice(5, 7)}/${mes.slice(0, 4)}`,
      faturamento: arredondar(grupo.faturamento),
      pedidos: grupo.pedidos,
    }));
}

export type FaixaDoHistograma = {
  inicio: number;
  fim: number;
  pedidos: number;
};

export function histograma(valores: number[], quantidadeDeFaixas = 5): FaixaDoHistograma[] {
  if (valores.length === 0) return [];

  const menor = Math.min(...valores);
  const maior = Math.max(...valores);

  if (menor === maior) {
    return [{ inicio: menor, fim: maior, pedidos: valores.length }];
  }

  const largura = (maior - menor) / quantidadeDeFaixas;
  const faixas: FaixaDoHistograma[] = [];

  for (let i = 0; i < quantidadeDeFaixas; i++) {
    faixas.push({ inicio: menor + i * largura, fim: menor + (i + 1) * largura, pedidos: 0 });
  }

  for (const valor of valores) {
    const posicao = Math.min(Math.floor((valor - menor) / largura), quantidadeDeFaixas - 1);
    faixas[posicao].pedidos += 1;
  }

  return faixas;
}
