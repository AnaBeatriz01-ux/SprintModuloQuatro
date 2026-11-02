import { useEffect, useState } from 'react';
import type { LinhaDeVenda } from '@logica/estatistica';
import { buscarVendas } from '../api/relatorios';
import { mensagemDoErro } from '../api/cliente';

export function useVendas() {
  const [vendas, setVendas] = useState<LinhaDeVenda[] | null>(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    buscarVendas()
      .then(setVendas)
      .catch((e) => setErro(mensagemDoErro(e)));
  }, []);

  return { vendas, erro };
}
