export class EstatisticaDescritiva {
  #valores: number[];

  constructor(valores: number[]) {
    if (valores.length === 0) {
      throw new Error('Precisa de pelo menos 1 valor pra calcular.');
    }
    this.#valores = [...valores].sort((a, b) => a - b);
  }

  get minimo(): number {
    return this.#valores[0];
  }

  get maximo(): number {
    return this.#valores[this.#valores.length - 1];
  }

  get media(): number {
    const soma = this.#valores.reduce((total, v) => total + v, 0);
    return soma / this.#valores.length;
  }

  get mediana(): number {
    const n = this.#valores.length;
    const meio = Math.floor(n / 2);

    if (n % 2 === 1) {
      return this.#valores[meio];
    }
    return (this.#valores[meio - 1] + this.#valores[meio]) / 2;
  }

  get desvioPadrao(): number {
    const n = this.#valores.length;
    if (n < 2) return 0;

    const media = this.media;
    const somaDosQuadrados = this.#valores.reduce((total, v) => total + (v - media) ** 2, 0);
    return Math.sqrt(somaDosQuadrados / (n - 1));
  }
}
