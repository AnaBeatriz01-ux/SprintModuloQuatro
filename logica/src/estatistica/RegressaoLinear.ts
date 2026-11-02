export class RegressaoLinear {
  #inclinacao = 0;
  #intercepto = 0;
  #correlacao = 0;

  constructor(x: number[], y: number[]) {
    if (x.length !== y.length || x.length < 2) {
      throw new Error('Regressão precisa de pelo menos 2 pontos (x e y do mesmo tamanho).');
    }

    const n = x.length;
    const mediaX = x.reduce((t, v) => t + v, 0) / n;
    const mediaY = y.reduce((t, v) => t + v, 0) / n;

    let sxy = 0;
    let sxx = 0;
    let syy = 0;
    for (let i = 0; i < n; i++) {
      sxy += (x[i] - mediaX) * (y[i] - mediaY);
      sxx += (x[i] - mediaX) ** 2;
      syy += (y[i] - mediaY) ** 2;
    }

    this.#inclinacao = sxx === 0 ? 0 : sxy / sxx;
    this.#intercepto = mediaY - this.#inclinacao * mediaX;
    this.#correlacao = sxx === 0 || syy === 0 ? 0 : sxy / Math.sqrt(sxx * syy);
  }

  get inclinacao(): number {
    return this.#inclinacao;
  }

  get intercepto(): number {
    return this.#intercepto;
  }

  get correlacao(): number {
    return this.#correlacao;
  }

  prever(x: number): number {
    return this.#inclinacao * x + this.#intercepto;
  }
}
