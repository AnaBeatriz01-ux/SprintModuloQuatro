type CartaoDeNumeroProps = {
  titulo: string;
  valor: string;
  detalhe?: string;
};

export default function CartaoDeNumero({ titulo, valor, detalhe }: CartaoDeNumeroProps) {
  return (
    <div className="card shadow-sm border-0 p-3 text-center h-100">
      <div className="fs-3 fw-bold text-danger">{valor}</div>
      <div className="text-muted small">{titulo}</div>
      {detalhe && <div className="small fw-semibold mt-1">{detalhe}</div>}
    </div>
  );
}
