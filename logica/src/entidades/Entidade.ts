export abstract class Entidade {
  #id: number | null;
  #criadoEm: Date;

  constructor(id: number | null, criadoEm: Date = new Date()) {
    this.#id = id;
    this.#criadoEm = criadoEm;
  }

  get id(): number {
    if (this.#id === null) {
      throw new Error('Esta entidade ainda não foi salva no banco, então não tem id.');
    }
    return this.#id;
  }

  get foiSalva(): boolean {
    return this.#id !== null;
  }

  get criadoEm(): Date {
    return this.#criadoEm;
  }

  abstract paraJSON(): Record<string, unknown>;

  protected dadosBasicos(): Record<string, unknown> {
    return {
      id: this.#id,
      criadoEm: this.#criadoEm.toISOString(),
    };
  }
}
