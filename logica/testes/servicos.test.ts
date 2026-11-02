import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Categoria, Cliente, Pedido, Produto } from '../src/entidades';
import { ErroDeConflito, ErroDeValidacao } from '../src/erros';
import { ServicoRelatorio, ServicoUsuario } from '../src/servicos';
import { CPF_VALIDO, CriptografiaFalsa, RepositorioDeUsuariosEmMemoria, RepositorioEmMemoria, SENHA_BOA } from './apoio';

const DADOS_DE_USUARIO = { nome: 'Ana Maria', email: 'ana@email.com', cpf: CPF_VALIDO, senha: SENHA_BOA };

function montarServicoDeUsuario() {
  return new ServicoUsuario(new RepositorioDeUsuariosEmMemoria(), new CriptografiaFalsa());
}

test('cadastro: campos obrigatórios e senha fraca são recusados', async () => {
  const servico = montarServicoDeUsuario();

  await assert.rejects(servico.cadastrar({ ...DADOS_DE_USUARIO, nome: '' }), ErroDeValidacao);
  await assert.rejects(servico.cadastrar({ ...DADOS_DE_USUARIO, email: 'ana@' }), ErroDeValidacao);
  await assert.rejects(servico.cadastrar({ ...DADOS_DE_USUARIO, cpf: '123' }), ErroDeValidacao);
  await assert.rejects(servico.cadastrar({ ...DADOS_DE_USUARIO, senha: '12345678' }), ErroDeValidacao);
  await assert.rejects(servico.cadastrar({ ...DADOS_DE_USUARIO, senha: undefined }), ErroDeValidacao);
});

test('cadastro: a senha é guardada criptografada e e-mail/CPF não repetem', async () => {
  const servico = montarServicoDeUsuario();

  const usuario = await servico.cadastrar(DADOS_DE_USUARIO);
  assert.notEqual(usuario.paraPersistencia().senhaHash, SENHA_BOA);
  assert.equal(usuario.cpf, '52998224725');

  await assert.rejects(servico.cadastrar(DADOS_DE_USUARIO), ErroDeConflito);
  await assert.rejects(servico.cadastrar({ ...DADOS_DE_USUARIO, email: 'outra@email.com' }), ErroDeConflito);
});

test('relatório: junta pedido, produto e categoria numa linha de venda', async () => {
  const categorias = new RepositorioEmMemoria<Categoria>((c, id) => new Categoria(id, c.nome, c.criadoEm));
  const produtos = new RepositorioEmMemoria<Produto>(
    (p, id) => new Produto(id, p.nome, p.descricao, p.preco, p.categoriaId, p.criadoEm)
  );
  const pedidos = new RepositorioEmMemoria<Pedido>(
    (p, id) => new Pedido(id, p.clienteId, p.produtoId, p.quantidade, p.valorUnitario, p.criadoEm, 'Bia Souza', 'Figura')
  );

  const categoria = await categorias.criar(new Categoria(null, 'Figures'));
  const produto = await produtos.criar(new Produto(null, 'Figura', '', 100, categoria.id));
  const cliente = new Cliente(1, 'Bia Souza', 'bia@email.com', '');
  await pedidos.criar(new Pedido(null, cliente.id, produto.id, 2, produto.preco));

  const vendas = await new ServicoRelatorio(pedidos, produtos, categorias).vendas();

  assert.equal(vendas.length, 1);
  assert.equal(vendas[0].categoriaNome, 'Figures');
  assert.equal(vendas[0].produtoNome, 'Figura');
  assert.equal(vendas[0].total, 200);
});
