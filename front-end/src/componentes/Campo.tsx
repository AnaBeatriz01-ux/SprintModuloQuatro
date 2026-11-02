import type { ReactNode } from 'react';

export type OpcaoDoSelect = {
  valor: string;
  rotulo: string;
};

export type TipoDoCampo = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select';

type CampoProps = {
  id: string;
  rotulo: string;
  valor: string;
  aoMudar: (novoValor: string) => void;
  tipo?: TipoDoCampo;
  erro?: string;
  dica?: string;
  opcoes?: OpcaoDoSelect[];
  desabilitado?: boolean;
  placeholder?: string;
  autoComplete?: string;
  children?: ReactNode;
};

export default function Campo({
  id, rotulo, valor, aoMudar, tipo = 'text', erro, dica, opcoes = [],
  desabilitado = false, placeholder, autoComplete, children,
}: CampoProps) {
  const classeDoErro = erro ? 'is-invalid' : '';

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold">{rotulo}</label>

      {tipo === 'textarea' && (
        <textarea id={id} className={`form-control ${classeDoErro}`} rows={3} value={valor}
                  disabled={desabilitado} onChange={(e) => aoMudar(e.target.value)} />
      )}

      {tipo === 'select' && (
        <select id={id} className={`form-select ${classeDoErro}`} value={valor}
                disabled={desabilitado} onChange={(e) => aoMudar(e.target.value)}>
          <option value="">Selecione...</option>
          {opcoes.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>{opcao.rotulo}</option>
          ))}
        </select>
      )}

      {tipo !== 'textarea' && tipo !== 'select' && (
        <input id={id} type={tipo} className={`form-control ${classeDoErro}`} value={valor}
               disabled={desabilitado} placeholder={placeholder} autoComplete={autoComplete}
               step={tipo === 'number' ? 'any' : undefined}
               onChange={(e) => aoMudar(e.target.value)} />
      )}

      {erro && <div className="invalid-feedback">{erro}</div>}
      {dica && !erro && <div className="form-text">{dica}</div>}
      {children}
    </div>
  );
}
