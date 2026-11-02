# Heartbeasties — rubrica atual

Parte do projeto Heartbeasties com só o que a rubrica atual pede:

| Rubrica | Onde está |
|---|---|
| Back-end: cadastro de usuário (nome, e-mail, senha e CPF obrigatórios; validação de CPF, nível de senha e e-mail) | `logica/src/servicos/ServicoUsuario.ts`, `logica/src/entidades/Usuario.ts`, `logica/src/validadores/`, rota `POST /api/usuarios` em `back-end/src/rotas/index.ts` |
| Front-end: cadastro (obrigatórios, senha dupla, CPF, e-mail, redireciona pro login, erros da API) | `front-end/src/paginas/Cadastro.tsx` |
| Probabilidade e Estatística: análise descritiva com gráficos | `front-end/src/paginas/Estatisticas.tsx` e `logica/src/estatistica/` |
| Tech Forge: encapsulamento e acesso controlado (get/set só com validação) | `logica/src/entidades/` (campos `#privados`, setters que validam) |

```
heartbeasties-rubrica-atual/
├── docker-compose.yml
├── logica/      entidades, serviços, validadores e estatística em POO (com testes)
├── back-end/    API: Node + Express + Sequelize + MySQL, em TypeScript
└── front-end/   React + TypeScript (TSX)
```

## Como rodar (Docker)

Com o Docker Desktop ligado, na pasta onde está o `docker-compose.yml`:

```
docker compose up --build
```

- Site: http://localhost:8080 (abre no cadastro; depois do cadastro vai para o login)
- API: http://localhost:3000/api
- Banco (DBeaver): `localhost`, porta `3307`, usuário `root`, senha `heartbeasties123`

A página **Estatísticas** precisa de dados de venda. Com os containers ligados, em outro terminal:

```
docker compose exec back-end npm run popular
```

Testes das regras de negócio: `cd logica`, `npm install`, `npm test`.

## Observações

- A tela de login é só o destino do redirecionamento depois do cadastro; o login de verdade não faz parte desta rubrica.
- O projeto completo (`heartbeasties-completo`) usa as mesmas portas. Rode um de cada vez.
- `docker compose down` desliga tudo e mantém o banco. `docker compose down -v` apaga o banco.
