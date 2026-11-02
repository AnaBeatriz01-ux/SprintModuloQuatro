export function moedaBR(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function numeroBR(valor: number): string {
  return valor.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
}
