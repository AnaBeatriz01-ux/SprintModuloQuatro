import 'dotenv/config';

export const ambiente = {
  porta: Number(process.env.PORTA ?? 3000),
  banco: {
    host: process.env.DB_HOST ?? 'localhost',
    porta: Number(process.env.DB_PORTA ?? 3306),
    nome: process.env.DB_NOME ?? 'heartbeasties',
    usuario: process.env.DB_USUARIO ?? 'root',
    senha: process.env.DB_SENHA ?? '',
  },
};
