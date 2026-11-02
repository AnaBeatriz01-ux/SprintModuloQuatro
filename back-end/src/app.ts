import cors from 'cors';
import express from 'express';
import type { Express } from 'express';
import { montarSistema } from './composicao';
import { tratarErros } from './middlewares';
import { criarRotas } from './rotas';

export function criarApp(): Express {
  const { controladores } = montarSistema();
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api', criarRotas(controladores));

  app.use(tratarErros);

  return app;
}
