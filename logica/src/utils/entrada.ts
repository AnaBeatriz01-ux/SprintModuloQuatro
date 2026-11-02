export function texto(valor: unknown): string {
  if (typeof valor === 'string') return valor;
  if (typeof valor === 'number') return String(valor);
  return '';
}

export function numero(valor: unknown): number {
  if (typeof valor === 'number') return valor;
  if (typeof valor === 'string' && valor.trim() !== '') return Number(valor);
  return Number.NaN;
}
