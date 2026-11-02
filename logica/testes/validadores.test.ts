import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpfEhValido, emailEhValido, formatarCpf, nivelDaSenha } from '../src/validadores';

test('CPF: aceita um válido e recusa dígito errado, repetido e curto', () => {
  assert.equal(cpfEhValido('529.982.247-25'), true);
  assert.equal(cpfEhValido('529.982.247-24'), false);
  assert.equal(cpfEhValido('111.111.111-11'), false);
  assert.equal(cpfEhValido('123'), false);
});

test('CPF: a máscara aparece enquanto digita', () => {
  assert.equal(formatarCpf('52998224725'), '529.982.247-25');
  assert.equal(formatarCpf('1234'), '123.4');
});

test('e-mail: confere o formato com regex', () => {
  assert.equal(emailEhValido('ana@email.com'), true);
  assert.equal(emailEhValido('ana@email'), false);
  assert.equal(emailEhValido('ana email@x.com'), false);
});

test('senha: fraca, média e forte', () => {
  assert.equal(nivelDaSenha('abc'), 'fraca');
  assert.equal(nivelDaSenha('abcdefgh1'), 'fraca');
  assert.equal(nivelDaSenha('Abcdefg1'), 'media');
  assert.equal(nivelDaSenha('Abcdef1!'), 'forte');
});
