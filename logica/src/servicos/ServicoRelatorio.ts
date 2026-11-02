import type { Repositorio } from '../contratos';
import type { Categoria, Pedido, Produto } from '../entidades';
import type { LinhaDeVenda } from '../estatistica';

export class ServicoRelatorio {
  constructor(
    private readonly pedidos: Repositorio<Pedido>,
    private readonly produtos: Repositorio<Produto>,
    private readonly categorias: Repositorio<Categoria>
  ) {}

  async vendas(): Promise<LinhaDeVenda[]> {
    const [listaDePedidos, listaDeProdutos, listaDeCategorias] = await Promise.all([
      this.pedidos.listarTodos(),
      this.produtos.listarTodos(),
      this.categorias.listarTodos(),
    ]);

    const produtoPorId = new Map<number, Produto>(listaDeProdutos.map((p): [number, Produto] => [p.id, p]));
    const categoriaPorId = new Map<number, Categoria>(listaDeCategorias.map((c): [number, Categoria] => [c.id, c]));

    return listaDePedidos.map((pedido): LinhaDeVenda => {
      const produto = produtoPorId.get(pedido.produtoId);
      const categoria = produto ? categoriaPorId.get(produto.categoriaId) : undefined;

      return {
        pedidoId: pedido.id,
        data: pedido.criadoEm.toISOString(),
        clienteNome: pedido.clienteNome ?? 'Cliente removido',
        produtoNome: pedido.produtoNome ?? produto?.nome ?? 'Produto removido',
        categoriaNome: categoria?.nome ?? 'Sem categoria',
        precoUnitario: pedido.valorUnitario,
        quantidade: pedido.quantidade,
        total: pedido.total,
      };
    });
  }
}
