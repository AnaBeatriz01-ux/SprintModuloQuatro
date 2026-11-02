import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Categoria, Pedido, Produto, Usuario } from '../src/entidades';
import { ErroDeValidacao } from '../src/erros';
import { CPF_VALIDO } from './apoio';

test('Usuario: nome curto é recusado pelo setter', () => {
  assert.throws(() => new Usuario(null, 'Al', 'ana@email.com', CPF_VALIDO), ErroDeValidacao);
});

test('Usuario: CPF inválido é recusado e CPF válido perde a máscara', () => {
  assert.throws(() => new Usuario(null, 'Ana Maria', 'ana@email.com', '111.111.111-11'), ErroDeValidacao);
  const usuario = new Usuario(null, 'Ana Maria', 'Ana@Email.com', CPF_VALIDO);
  assert.equal(usuario.cpf, '52998224725');
  assert.equal(usuario.email, 'ana@email.com');
});

test('Usuario: o e-mail não tem setter, então não dá pra trocar', () => {
  const usuario = new Usuario(null, 'Ana Maria', 'ana@email.com', CPF_VALIDO);
  const tentativa = usuario as unknown as { email: string };
  assert.throws(() => {
    tentativa.email = 'outro@email.com';
  }, TypeError);
  assert.equal(usuario.email, 'ana@email.com');
});

test('Usuario: o JSON nunca mostra a senha', () => {
  const usuario = new Usuario(1, 'Ana Maria', 'ana@email.com', CPF_VALIDO, 'hash-secreto');
  const json = usuario.paraJSON();
  assert.equal('senhaHash' in json, false);
  assert.equal(JSON.stringify(json).includes('hash-secreto'), false);
});

test('Entidade: pedir o id de algo que não foi salvo dá erro', () => {
  const categoria = new Categoria(null, 'Figures');
  assert.equal(categoria.foiSalva, false);
  assert.throws(() => categoria.id);
});

test('Produto: preço negativo é recusado e o preço é arredondado', () => {
  assert.throws(() => new Produto(null, 'Figura', '', -1, 1), ErroDeValidacao);
  const produto = new Produto(null, 'Figura', '', 10.456, 1);
  assert.equal(produto.preco, 10.46);
});

test('Pedido: o total é quantidade x preço congelado', () => {
  const pedido = new Pedido(null, 1, 2, 3, 19.9);
  assert.equal(pedido.total, 59.7);

  pedido.quantidade = 2;
  assert.equal(pedido.total, 39.8);
  assert.throws(() => {
    pedido.quantidade = 0;
  }, ErroDeValidacao);
});

test('polimorfismo: o mesmo paraJSON() funciona pra qualquer entidade', () => {
  const entidades = [
    new Categoria(1, 'Figures'),
    new Produto(2, 'Figura 1', '', 10, 1),
    new Pedido(3, 1, 2, 1, 10),
  ];
  for (const entidade of entidades) {
    assert.equal(typeof entidade.paraJSON().id, 'number');
  }
});
