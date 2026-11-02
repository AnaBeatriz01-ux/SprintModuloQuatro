import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  EstatisticaDescritiva, RegressaoLinear, faturamentoPorMes, faturamentoTotal, histograma,
  produtoMaisVendido, ticketMedio, unidadesPorProduto,
} from '../src/estatistica';
import type { LinhaDeVenda } from '../src/estatistica';

function venda(produto: string, preco: number, quantidade: number, data: string): LinhaDeVenda {
  return {
    pedidoId: 1, data, clienteNome: 'Bia', produtoNome: produto, categoriaNome: 'Figures',
    precoUnitario: preco, quantidade, total: preco * quantidade,
  };
}

const VENDAS = [
  venda('Figura 1', 100, 2, '2026-08-10T10:00:00.000Z'),
  venda('Figura 2', 50, 1, '2026-08-20T10:00:00.000Z'),
  venda('Figura 1', 100, 1, '2026-09-05T10:00:00.000Z'),
];

test('descritiva: média, mediana e desvio padrão', () => {
  const stats = new EstatisticaDescritiva([4, 1, 3, 2]);
  assert.equal(stats.media, 2.5);
  assert.equal(stats.mediana, 2.5);
  assert.equal(stats.minimo, 1);
  assert.equal(stats.maximo, 4);
  assert.ok(Math.abs(stats.desvioPadrao - 1.2909944487) < 1e-9);
  assert.equal(new EstatisticaDescritiva([5]).desvioPadrao, 0);
  assert.throws(() => new EstatisticaDescritiva([]));
});

test('descritiva: guarda uma cópia, então mexer no array de fora não muda o resultado', () => {
  const original = [1, 2, 3];
  const stats = new EstatisticaDescritiva(original);
  original.push(1000);
  assert.equal(stats.maximo, 3);
});

test('regressão: preço mais alto, menos vendas (correlação negativa)', () => {
  const regressao = new RegressaoLinear([10, 20, 30], [9, 5, 1]);
  assert.ok(regressao.correlacao < -0.99);
  assert.ok(regressao.inclinacao < 0);
  assert.ok(Math.abs(regressao.prever(20) - 5) < 1e-9);
  assert.equal(new RegressaoLinear([5, 5], [1, 2]).inclinacao, 0);
});

test('métricas: faturamento, ticket médio e produto mais vendido', () => {
  assert.equal(faturamentoTotal(VENDAS), 350);
  assert.equal(ticketMedio(VENDAS), 116.67);
  assert.equal(ticketMedio([]), 0);
  assert.deepEqual(produtoMaisVendido(VENDAS), { produto: 'Figura 1', unidades: 3, preco: 100 });
  assert.equal(unidadesPorProduto(VENDAS).length, 2);
});

test('métricas: série temporal por mês, em ordem', () => {
  const meses = faturamentoPorMes(VENDAS);
  assert.deepEqual(meses.map((m) => m.rotulo), ['08/2026', '09/2026']);
  assert.deepEqual(meses.map((m) => m.faturamento), [250, 100]);
});

test('histograma: todos os valores caem em alguma faixa', () => {
  const faixas = histograma([1, 2, 3, 4, 5, 10], 3);
  assert.equal(faixas.length, 3);
  assert.equal(faixas.reduce((soma, f) => soma + f.pedidos, 0), 6);
  assert.equal(histograma([], 3).length, 0);
});
