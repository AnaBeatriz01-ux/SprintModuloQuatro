import { Router } from 'express';
import type { ControladorDeRelatorios, ControladorDeUsuarios } from '../controladores';
import { capturarErros } from '../middlewares';

export type Controladores = {
  usuarios: ControladorDeUsuarios;
  relatorios: ControladorDeRelatorios;
};

export function criarRotas(controladores: Controladores): Router {
  const roteador = Router();

  roteador.post('/usuarios', capturarErros(controladores.usuarios.cadastrar));
  roteador.get('/relatorios/vendas', capturarErros(controladores.relatorios.vendas));

  return roteador;
}
