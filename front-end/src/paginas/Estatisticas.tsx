import type { ReactNode } from 'react';
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis,
  ReferenceLine,
} from 'recharts';
import {
  EstatisticaDescritiva, RegressaoLinear, faturamentoPorMes, faturamentoTotal, histograma, ticketMedio, unidadesPorProduto,
} from '@logica/estatistica';
import type { LinhaDeVenda, UnidadesPorProduto } from '@logica/estatistica';
import Alerta from '../componentes/Alerta';
import CartaoDeNumero from '../componentes/CartaoDeNumero';
import { moedaBR, numeroBR } from '../formatadores';
import { useVendas } from '../hooks/useVendas';

const COR = '#6D2E46';

function QuadroDoGrafico({ titulo, pergunta, children }: { titulo: string; pergunta: string; children: ReactNode }) {
  return (
    <div className="card shadow-sm border-0 p-3 h-100">
      <h5 className="fw-bold mb-0">{titulo}</h5>
      <p className="text-muted small">{pergunta}</p>
      {children}
    </div>
  );
}

function TabelaDeMedidas({ vendas }: { vendas: LinhaDeVenda[] }) {
  const linhas = [
    { nome: 'Valor do pedido', stats: new EstatisticaDescritiva(vendas.map((v) => v.total)), moeda: true },
    { nome: 'Quantidade por pedido', stats: new EstatisticaDescritiva(vendas.map((v) => v.quantidade)), moeda: false },
    { nome: 'Preço do produto vendido', stats: new EstatisticaDescritiva(vendas.map((v) => v.precoUnitario)), moeda: true },
  ];

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-header bg-white fw-bold">Medidas descritivas</div>
      <div className="table-responsive">
        <table className="table mb-0 align-middle">
          <thead className="table-light">
            <tr><th>Variável</th><th>Média</th><th>Mediana</th><th>Desvio padrão</th><th>Mínimo</th><th>Máximo</th></tr>
          </thead>
          <tbody>
            {linhas.map(({ nome, stats, moeda }) => {
              const formatar = moeda ? moedaBR : numeroBR;
              return (
                <tr key={nome}>
                  <td className="fw-semibold">{nome}</td>
                  <td>{formatar(stats.media)}</td>
                  <td>{formatar(stats.mediana)}</td>
                  <td>{formatar(stats.desvioPadrao)}</td>
                  <td>{formatar(stats.minimo)}</td>
                  <td>{formatar(stats.maximo)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GraficoDeBarras({ vendas }: { vendas: LinhaDeVenda[] }) {
  return (
    <QuadroDoGrafico titulo="Unidades vendidas por produto" pergunta="Quais produtos mais vendem?">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={unidadesPorProduto(vendas)} margin={{ top: 10, right: 20, bottom: 40, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="produto" angle={-20} textAnchor="end" interval={0} height={60} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="unidades" name="Unidades" fill={COR} />
        </BarChart>
      </ResponsiveContainer>
    </QuadroDoGrafico>
  );
}

function GraficoDeSerieTemporal({ vendas }: { vendas: LinhaDeVenda[] }) {
  return (
    <QuadroDoGrafico titulo="Faturamento por mês" pergunta="O faturamento está crescendo ao longo do tempo?">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={faturamentoPorMes(vendas)} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rotulo" />
          <YAxis tickFormatter={(valor: number) => numeroBR(valor)} />
          <Tooltip formatter={(valor) => moedaBR(Number(valor))} />
          <Line type="monotone" dataKey="faturamento" name="Faturamento" stroke={COR} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </QuadroDoGrafico>
  );
}

function GraficoDeHistograma({ vendas }: { vendas: LinhaDeVenda[] }) {
  const faixas = histograma(vendas.map((v) => v.total), 5).map((faixa) => ({
    rotulo: `${numeroBR(faixa.inicio)} a ${numeroBR(faixa.fim)}`,
    pedidos: faixa.pedidos,
  }));

  return (
    <QuadroDoGrafico titulo="Distribuição do valor dos pedidos" pergunta="Os pedidos costumam ser de qual valor (R$)?">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={faixas} barCategoryGap={0} margin={{ top: 10, right: 20, bottom: 40, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rotulo" angle={-20} textAnchor="end" interval={0} height={60} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="pedidos" name="Pedidos" fill="#b5838d" />
        </BarChart>
      </ResponsiveContainer>
    </QuadroDoGrafico>
  );
}

function interpretarCorrelacao(regressao: RegressaoLinear): string {
  const r = regressao.correlacao;
  const forca = Math.abs(r);

  let intensidade = 'fraca';
  if (forca >= 0.7) intensidade = 'forte';
  else if (forca >= 0.3) intensidade = 'moderada';

  const sentido = r < 0 ? 'quanto maior o preço, menos o produto vende' : 'quanto maior o preço, mais o produto vende';
  const aCadaCem = numeroBR(regressao.inclinacao * 100);

  return `Correlação ${intensidade} (r = ${numeroBR(r)}): ${sentido}. A cada R$ 100 a mais no preço, as vendas mudam em média ${aCadaCem} unidades.`;
}

function GraficoDeDispersao({ vendas }: { vendas: LinhaDeVenda[] }) {
  const produtos: UnidadesPorProduto[] = unidadesPorProduto(vendas);

  if (produtos.length < 2) {
    return (
      <QuadroDoGrafico titulo="Preço × unidades vendidas" pergunta="O preço influencia nas vendas?">
        <p className="text-muted">Cadastre pedidos de pelo menos 2 produtos pra calcular a regressão.</p>
      </QuadroDoGrafico>
    );
  }

  const regressao = new RegressaoLinear(produtos.map((p) => p.preco), produtos.map((p) => p.unidades));
  const precoMinimo = Math.min(...produtos.map((p) => p.preco));
  const precoMaximo = Math.max(...produtos.map((p) => p.preco));

  return (
    <QuadroDoGrafico titulo="Preço × unidades vendidas" pergunta="O preço influencia nas vendas?">
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 25, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="preco" name="Preço" domain={['dataMin', 'dataMax']}
                 tickFormatter={(valor: number) => numeroBR(valor)}
                 label={{ value: 'Preço (R$)', position: 'insideBottom', offset: -15 }} />
          <YAxis type="number" dataKey="unidades" name="Unidades" domain={[0, 'auto']} allowDecimals={false}
                 label={{ value: 'Unidades vendidas', angle: -90, position: 'insideLeft' }} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Produtos" data={produtos} fill={COR} />
          <ReferenceLine
            segment={[
              { x: precoMinimo, y: regressao.prever(precoMinimo) },
              { x: precoMaximo, y: regressao.prever(precoMaximo) },
            ]}
            stroke="#dc3545" strokeWidth={2} ifOverflow="extendDomain"
          />
        </ScatterChart>
      </ResponsiveContainer>
      <p className="small fw-semibold mt-2 mb-0">{interpretarCorrelacao(regressao)}</p>
    </QuadroDoGrafico>
  );
}

export default function Estatisticas() {
  const { vendas, erro } = useVendas();

  return (
    <div className="container my-5">
      <h1 className="fw-bold mb-1"><i className="bi bi-graph-up-arrow"></i> Estatísticas</h1>
      <p className="text-muted mb-4">Análise descritiva das vendas: medidas e gráficos que respondem perguntas da loja.</p>

      {erro && <Alerta tipo="erro">{erro}</Alerta>}
      {vendas === null && !erro && <p className="text-muted">Carregando...</p>}
      {vendas !== null && vendas.length === 0 && (
        <Alerta tipo="info">Ainda não existem pedidos. Cadastre pedidos (ou rode "npm run popular" no back-end) pra ver os gráficos.</Alerta>
      )}

      {vendas !== null && vendas.length > 0 && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-6 col-lg-4"><CartaoDeNumero titulo="faturamento total" valor={moedaBR(faturamentoTotal(vendas))} /></div>
            <div className="col-6 col-lg-4"><CartaoDeNumero titulo="ticket médio" valor={moedaBR(ticketMedio(vendas))} /></div>
            <div className="col-12 col-lg-4"><CartaoDeNumero titulo="pedidos analisados" valor={String(vendas.length)} /></div>
          </div>

          <TabelaDeMedidas vendas={vendas} />

          <div className="row g-4">
            <div className="col-12 col-xl-6"><GraficoDeBarras vendas={vendas} /></div>
            <div className="col-12 col-xl-6"><GraficoDeSerieTemporal vendas={vendas} /></div>
            <div className="col-12 col-xl-6"><GraficoDeHistograma vendas={vendas} /></div>
            <div className="col-12 col-xl-6"><GraficoDeDispersao vendas={vendas} /></div>
          </div>
        </>
      )}
    </div>
  );
}
