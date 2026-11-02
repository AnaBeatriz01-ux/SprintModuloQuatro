export function somenteNumeros(texto: string): string {
  return texto.replace(/\D/g, '');
}

export function cpfEhValido(cpfDigitado: string): boolean {
  const cpf = somenteNumeros(cpfDigitado);

  if (cpf.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cpf)) return false;

  for (let tamanho = 9; tamanho <= 10; tamanho++) {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) {
      soma += Number(cpf[i]) * (tamanho + 1 - i);
    }
    let digito = (soma * 10) % 11;
    if (digito === 10) digito = 0;

    if (digito !== Number(cpf[tamanho])) return false;
  }

  return true;
}

export function formatarCpf(valor: string): string {
  return somenteNumeros(valor)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
