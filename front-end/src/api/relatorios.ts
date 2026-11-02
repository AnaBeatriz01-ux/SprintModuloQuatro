import type { LinhaDeVenda } from '@logica/estatistica';
import { requisitar } from './cliente';

export function buscarVendas(): Promise<LinhaDeVenda[]> {
  return requisitar<LinhaDeVenda[]>('GET', '/relatorios/vendas');
}
