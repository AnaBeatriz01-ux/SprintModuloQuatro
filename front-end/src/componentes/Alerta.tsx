import type { ReactNode } from 'react';

type TipoDeAlerta = 'sucesso' | 'erro' | 'aviso' | 'info';

const CLASSES: Record<TipoDeAlerta, string> = {
  sucesso: 'alert-success',
  erro: 'alert-danger',
  aviso: 'alert-warning',
  info: 'alert-info',
};

type AlertaProps = {
  tipo: TipoDeAlerta;
  children: ReactNode;
};

export default function Alerta({ tipo, children }: AlertaProps) {
  return <div className={`alert ${CLASSES[tipo]}`}>{children}</div>;
}
