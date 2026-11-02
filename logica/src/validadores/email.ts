export const REGEX_DE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailEhValido(email: string): boolean {
  return REGEX_DE_EMAIL.test(email);
}
